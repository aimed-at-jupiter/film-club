const db = require("../db/connection");

const fetchUserByEmail = (email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((result) => result.rows[0]); // returns undefined if not found
};

const insertUser = (username, email, hashedPassword) => {
  const queryStr = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING user_id, username, email, role;
  `;
  const values = [username, email, hashedPassword];

  return db.query(queryStr, values).then(({ rows }) => rows[0]);
};

module.exports = { fetchUserByEmail, insertUser };
