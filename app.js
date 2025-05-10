const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const registrationRoutes = require("./routes/registration");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Log setiap request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Rute utama
app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/registration", registrationRoutes);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Route Not found");
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.method} ${req.url}`
  );
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
