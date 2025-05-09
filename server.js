const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const port = env.port || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
