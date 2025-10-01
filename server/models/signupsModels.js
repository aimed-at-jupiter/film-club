const db = require("../db/connection");

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
module.exports = { addSignup };
