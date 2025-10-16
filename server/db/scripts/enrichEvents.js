/**
 * server/db/scripts/enrichEvents.js
 *
 * One-off script to enrich events rows with OMDb-derived fields.
 *
 * Usage:
 *   NODE_ENV=development node server/db/scripts/enrichEvents.js
 *
 * Environment:
 *   - OMDB_API_KEY must be available in process.env (same .env used by your backend).
 *   - DB connection is read from server/db/connection.js (the script expects that module to export a usable `query` function or a `pool` with query/end).
 *
 * What it does:
 *   - SELECT event_id, film_title, film_year FROM events [toggleable WHERE].
 *   - For each row, call OMDb: https://www.omdbapi.com/?t=...&y=...&apikey=...
 *   - If OMDb returns Response: "True", update only the following columns if they are NULL or empty:
 *       film_writer, film_plot, film_genre, film_actors, film_runtime, film_country, film_language, film_imdb_id
 *   - If OMDb returns Response: "False", logs and skips.
 *
 * Notes:
 *   - Does NOT overwrite existing non-empty values in the above columns.
 *   - Uses parameterized queries.
 *   - Designed to be simple and deleteable after use.
 */

const path = require("path");
const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.resolve(__dirname, `../../.env.${ENV}`),
});

const fs = require("fs");

const OMDB_API_KEY = process.env.OMDB_API_KEY;
if (!OMDB_API_KEY) {
  console.error("ERROR: OMDB_API_KEY not set in environment. Exiting.");
  process.exit(1);
}

// Require your existing DB connection. From this script location (server/db/scripts/) going up one level to server/db/connection.js
// Adjust path if your repo layout differs.
const dbModulePath = path.join(__dirname, "..", "connection.js");
if (!fs.existsSync(dbModulePath)) {
  console.error(
    `ERROR: expected DB connection module at ${dbModulePath} but file not found.`
  );
  process.exit(1);
}

const db = require(dbModulePath);

// Helper to normalize how we call query and end regardless of how connection.js exports things
let queryFn;
let endFn;
if (typeof db.query === "function") {
  // exported query function directly or a client-like object
  queryFn = db.query.bind(db);
  if (typeof db.end === "function") endFn = db.end.bind(db);
  else if (db.pool && typeof db.pool.end === "function")
    endFn = db.pool.end.bind(db.pool);
} else if (db.pool && typeof db.pool.query === "function") {
  // typical: module.exports = new Pool(...)
  queryFn = db.pool.query.bind(db.pool);
  endFn = db.pool.end ? db.pool.end.bind(db.pool) : null;
} else if (typeof db === "function") {
  // maybe the module exported a function that is query
  queryFn = db;
  endFn = null;
} else {
  console.error(
    "ERROR: Could not detect query function from server/db/connection.js exports. Expected .query or .pool.query."
  );
  process.exit(1);
}

// Ensure fetch exists (Node 18+ has global fetch). Fallback to node-fetch if absent.
let fetchFn;
if (typeof fetch === "function") {
  fetchFn = fetch;
} else {
  try {
    // eslint-disable-next-line global-require
    fetchFn = require("node-fetch").default;
  } catch (err) {
    console.error(
      "ERROR: global fetch not available and node-fetch not installed. Install node-fetch or run on Node 18+."
    );
    process.exit(1);
  }
}

// Toggleable WHERE clause: set a SQL fragment to filter the rows you want to process.
// Example: const WHERE_CLAUSE = "WHERE event_id BETWEEN 1 AND 200";
// Default is empty (process all events).
const WHERE_CLAUSE = ""; // <-- change if you want to limit which events are processed

// Primary select - reads minimal identifying info
const SELECT_EVENTS_SQL = `SELECT event_id, film_title, film_year FROM events ${WHERE_CLAUSE};`;

// Target columns mapping from OMDb response keys to DB column names
const OMDB_TO_DB = {
  Writer: "film_writer",
  Plot: "film_plot",
  Genre: "film_genre",
  Actors: "film_actors",
  Runtime: "film_runtime",
  Country: "film_country",
  Language: "film_language",
  imdbID: "film_imdb_id",
};

function buildOmdbUrl(title, year) {
  const q = new URLSearchParams({
    t: title,
    apikey: OMDB_API_KEY,
  });
  if (year) q.set("y", String(year));
  return `https://www.omdbapi.com/?${q.toString()}`;
}

function isEmptyDbVal(val) {
  // treat null, undefined, empty string as empty; whitespace-only counts as empty
  return (
    val === null ||
    val === undefined ||
    (typeof val === "string" && val.trim() === "")
  );
}

async function enrich() {
  console.log("Starting events enrichment script...");
  try {
    const res = await queryFn(SELECT_EVENTS_SQL);
    const rows = res.rows || res; // some clients return rows directly
    console.log(`Found ${rows.length} event(s) to evaluate.`);

    for (const row of rows) {
      const eventId = row.event_id;
      const filmTitle = row.film_title;
      const filmYear = row.film_year;

      if (!filmTitle || String(filmTitle).trim() === "") {
        console.log(`Skipping event_id ${eventId}: film_title empty.`);
        continue;
      }

      const friendlyTitle = `${filmTitle}${filmYear ? ` (${filmYear})` : ""}`;

      // Before calling OMDb, fetch current target column values so we only update empties
      const targetCols = Object.values(OMDB_TO_DB);
      const selectTargetsSql = `SELECT ${targetCols.join(
        ", "
      )} FROM events WHERE event_id = $1`;
      const currentRes = await queryFn(selectTargetsSql, [eventId]);
      const current =
        (currentRes.rows && currentRes.rows[0]) || currentRes[0] || {};

      // If all target columns are already non-empty, skip (safer approach)
      const alreadyPopulated = targetCols.every(
        (c) => !isEmptyDbVal(current[c])
      );
      if (alreadyPopulated) {
        console.log(
          `Skipping event_id ${eventId} (${friendlyTitle}): all target fields already populated.`
        );
        continue;
      }

      // Call OMDb
      const url = buildOmdbUrl(filmTitle, filmYear);
      let omdbJson;
      try {
        const resp = await fetchFn(url);
        if (!resp.ok) {
          console.error(
            `OMDb HTTP error for event_id ${eventId} (${friendlyTitle}): ${resp.status} ${resp.statusText}`
          );
          continue;
        }
        omdbJson = await resp.json();
      } catch (err) {
        console.error(
          `Network/Fetch error for event_id ${eventId} (${friendlyTitle}):`,
          err.message || err
        );
        continue;
      }

      if (!omdbJson || omdbJson.Response === "False") {
        console.log(
          `Skipping event_id ${eventId} (${friendlyTitle}): OMDb not found. OMDb Error: ${
            omdbJson && omdbJson.Error ? omdbJson.Error : "no details"
          }`
        );
        continue;
      }

      // Build update set for only the fields that are empty in DB and present in OMDb
      const fieldsToUpdate = [];
      const values = [];
      let paramIdx = 1;
      for (const [omdbKey, dbCol] of Object.entries(OMDB_TO_DB)) {
        const omdbVal = omdbJson[omdbKey];
        const currentVal = current[dbCol];

        // Only set if OMDb provided a value and DB current value is empty
        if (!isEmptyDbVal(omdbVal) && isEmptyDbVal(currentVal)) {
          fieldsToUpdate.push(`${dbCol} = $${paramIdx}`);
          values.push(String(omdbVal)); // keep everything as string (DB columns likely text)
          paramIdx += 1;
        }
      }

      if (fieldsToUpdate.length === 0) {
        console.log(
          `Skipping event_id ${eventId} (${friendlyTitle}): OMDb had data but no target fields are empty.`
        );
        continue;
      }

      // Finalize update query
      const updateSql = `UPDATE events SET ${fieldsToUpdate.join(
        ", "
      )} WHERE event_id = $${paramIdx}`;
      values.push(eventId);

      try {
        const updRes = await queryFn(updateSql, values);
        console.log(
          `Updated event_id ${eventId} (${friendlyTitle}): updated fields: ${fieldsToUpdate
            .map((f) => f.split(" = ")[0])
            .join(", ")}`
        );
      } catch (err) {
        console.error(
          `DB update error for event_id ${eventId} (${friendlyTitle}):`,
          err.message || err
        );
      }

      // Gentle pause could be added here if you hit rate-limits, but keeping it simple and sequential
      // await new Promise(r => setTimeout(r, 100)); // optional small delay
    }

    console.log("Enrichment run complete.");
    // close DB if endFn available
    if (typeof endFn === "function") {
      await endFn();
      // some pool.end returns a promise and some don't; awaiting is safe for promise or non-promise
    }
    process.exit(0);
  } catch (err) {
    console.error("Fatal error during enrichment:", err);
    try {
      if (typeof endFn === "function") await endFn();
    } catch (e) {
      // ignore
    }
    process.exit(1);
  }
}

// Kick off
enrich();
