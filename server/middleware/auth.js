const jwt = require("jsonwebtoken");

const requireAuth = (request, response, next) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return response.status(401).send({ msg: "Authorization required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return response.status(401).send({ msg: "Invalid or expired token" });
    }
    request.user = decoded; // attach user info to request (id, role)
    next();
  });
};

const requireStaff = (request, response, next) => {
  if (request.user && request.user.role === "staff") {
    return next();
  }
  return response.status(403).send({ msg: "Forbidden: staff only" });
};

module.exports = { requireAuth, requireStaff };
