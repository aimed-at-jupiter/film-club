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

module.exports = { fetchEvents, fetchEventById };
