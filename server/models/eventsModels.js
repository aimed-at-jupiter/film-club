const db = require("../db/connection");

const fetchEvents = () => {
  return db
    .query(
      `SELECT * 
       FROM events
       ORDER BY date ASC, start_time ASC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchEventById = (id) => {
  return db
    .query(`SELECT * FROM events WHERE id = $1;`, [id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Event not found" });
      }
      return rows[0];
    });
};

const addEvent = (eventData) => {
  const {
    date,
    start_time,
    end_time,
    location,
    film_title,
    film_director,
    film_year,
    film_img_url,
    event_type,
    price,
  } = eventData;

  const title = `${film_title} (${event_type})`;

  const queryStr = `
    INSERT INTO events
    (title, date, start_time, end_time, location, film_title, film_director, film_year, film_img_url, event_type, price)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING event_id,
    title,
    TO_CHAR(date, 'YYYY-MM-DD') AS date,
    TO_CHAR(start_time, 'HH24:MI') AS start_time,
    TO_CHAR(end_time, 'HH24:MI') AS end_time,
    location,
    film_title,
    film_director,
    film_year,
    film_img_url,
    event_type,
    price::INT AS price,
    created_at;
  `;

  const values = [
    title,
    date,
    start_time,
    end_time,
    location,
    film_title,
    film_director,
    film_year,
    film_img_url || "",
    event_type,
    price,
  ];

  return db.query(queryStr, values).then(({ rows }) => rows[0]);
};

module.exports = { fetchEvents, fetchEventById, addEvent };
