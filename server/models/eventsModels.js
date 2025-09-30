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

module.exports = { fetchEvents };
