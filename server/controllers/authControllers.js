const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { fetchUserByEmail, insertUser } = require("../models/usersModels");

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

        const token = jwt.sign(
          { id: user.user_id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        response.status(200).send({ token });
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

module.exports = { login, registerUser };
