const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertUser } = require("../models/usersModels");

const registerUser = (request, response, next) => {
  const { username, email, password } = request.body;

  if (!username || !email || !password) {
    return response.status(400).send({ msg: "Missing required fields" });
  }

  const saltRounds = 10;

  bcrypt
    .hash(password, saltRounds)
    .then((hashedPassword) => {
      return insertUser(username, email, hashedPassword);
    })
    .then((user) => {
      // Sign a JWT for the new user
      const token = jwt.sign(
        { id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      response.status(201).send({ token });
    })
    .catch((err) => {
      // Handle duplicate emails or usernames safely
      if (err.code === "23505") {
        // Postgres unique_violation
        return response.status(400).send({ msg: "Invalid request" }); // avoid leaking which field was duplicated
      }
      next(err);
    });
};

module.exports = { registerUser };
