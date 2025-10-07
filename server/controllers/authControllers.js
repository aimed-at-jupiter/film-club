const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { fetchUserByEmail } = require("../models/usersModels");

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

module.exports = { login };
