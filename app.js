const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");
const registrationRoutes = require("./routes/registration");
const { swaggerUi, specs } = require("./swagger");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to Event Management API</h1>
    <p>Visit <a href="/api-docs">API Documentation</a> to explore the endpoints.</p>
  `);
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/registration", registrationRoutes);

app.use((req, res, next) => {
  const error = new Error("Route Not found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.method} ${req.url}`
  );
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
