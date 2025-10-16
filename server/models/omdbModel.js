const fetch = require("node-fetch");
const path = require("path");

const ENV = process.env.NODE_ENV || "development";
require("dotenv").config({
  path: path.resolve(__dirname, `../../.env.${ENV}`),
});

const OMDB_API_KEY = process.env.OMDB_API_KEY;

if (!OMDB_API_KEY) {
  console.error("Missing OMDB_API_KEY in environment");
  process.exit(1);
}

const fetchOmdbData = (title, year) => {
  if (!title || String(title).trim() === "") {
    return Promise.reject({ status: 400, msg: "Missing title parameter" });
  }

  const url =
    `https://www.omdbapi.com/?t=${encodeURIComponent(title)}` +
    (year ? `&y=${encodeURIComponent(year)}` : "") +
    `&apikey=${OMDB_API_KEY}`;

  return fetch(url)
    .then((res) => {
      if (!res.ok) {
        return Promise.reject({
          status: res.status,
          msg: "Failed to reach OMDb API",
        });
      }
      return res.json();
    })
    .then((data) => {
      if (!data || data.Response === "False") {
        return Promise.reject({
          status: 404,
          msg: data.Error || "Film not found",
        });
      }

      return {
        film_title: data.Title || "",
        film_year: data.Year || "",
        film_director: data.Director || "",
        film_writer: data.Writer || "",
        film_plot: data.Plot || "",
        film_genre: data.Genre || "",
        film_actors: data.Actors || "",
        film_runtime: data.Runtime || "",
        film_country: data.Country || "",
        film_language: data.Language || "",
        film_img_url: data.Poster !== "N/A" ? data.Poster : "",
        film_imdb_id: data.imdbID || "",
      };
    })
    .catch((err) => {
      if (err.status && err.msg) return Promise.reject(err);
      return Promise.reject({
        status: 500,
        msg: "Unexpected OMDb fetch error",
      });
    });
};

module.exports = { fetchOmdbData };
