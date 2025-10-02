const db = require("../connection");

const fetchUserByEmail = (email) => {
  return db
    .query("SELECT * FROM users WHERE email = $1", [email])
    .then((result) => result.rows[0]); // returns undefined if not found
};

module.exports = { fetchUserByEmail };
