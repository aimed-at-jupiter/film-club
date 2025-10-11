const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
}

module.exports = { createToken };
