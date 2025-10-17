const db = require("../db/connection");

const fetchSignupsByUser = (user_id) => {
  const query = `
    SELECT s.signup_id, s.event_id, e.film_title, e.date, e.event_type, e.location
    FROM signups s
    JOIN events e ON s.event_id = e.event_id
    WHERE s.user_id = $1
    ORDER BY e.date DESC;
  `;
  return db.query(query, [user_id]).then(({ rows }) => rows);
};

const checkIfUserSignedUp = (user_id, event_id) => {
  const query = `
    SELECT * FROM signups
    WHERE user_id = $1 AND event_id = $2;
  `;
  return db
    .query(query, [user_id, event_id])
    .then(({ rows }) => rows.length > 0);
};

const addSignup = (user_id, event_id) => {
  const queryStr = `
    INSERT INTO signups (user_id, event_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  return db
    .query(queryStr, [user_id, event_id])
    .then(({ rows }) => rows[0])
    .catch((err) => {
      if (err.code === "23503") {
        // foreign key violation
        return Promise.reject({ status: 404, msg: "User or event not found" });
      }
      if (err.code === "23505") {
        // unique violation (already signed up)
        return Promise.reject({ status: 409, msg: "Already signed up" });
      }
      return Promise.reject(err);
    });
};
module.exports = { fetchSignupsByUser, checkIfUserSignedUp, addSignup };
