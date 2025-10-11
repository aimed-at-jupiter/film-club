const bcrypt = require("bcrypt");
const { fetchUserByEmail, insertUser } = require("../models/usersModels");
const { createToken } = require("../utils/createToken");
const { sanitiseUser } = require("../utils/sanitizeUser");

const login = (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).send({ msg: "email and password required" });
  }

  fetchUserByEmail(email)
    .then((user) => {
      if (!user)
        return response.status(401).send({ msg: "Invalid credentials" });

      return bcrypt.compare(password, user.password).then((match) => {
        if (!match)
          return response.status(401).send({ msg: "Invalid credentials" });

        const token = createToken(user);
        const safeUser = sanitiseUser(user);

        response.status(200).send({
          token,
          user: safeUser,
        });
      });
    })
    .catch(next);
};

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
      const token = createToken(user);
      const safeUser = sanitiseUser(user);

      response.status(201).send({
        token,
        user: safeUser,
      });
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

module.exports = { login, registerUser };
