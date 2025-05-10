const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");
const logger = require("../utils/logger");

exports.protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

exports.adminOnly = (req, res, next) => {
  // logger.info(`${req.user}`);
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin access only" });
  next();
};
