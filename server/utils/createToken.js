const jwt = require("jsonwebtoken");

function createToken(user) {
  return jwt.sign(
    { id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
}

module.exports = { createToken };
