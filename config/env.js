require("dotenv").config();

exports.port = process.env.PORT;
exports.mongoUrl = process.env.MONGO_URL;
exports.jwtSecret = process.env.JWT_KEY;
exports.cloudinaryCloud = process.env.CLOUD_NAME;
exports.cloudinaryApiKey = process.env.API_KEY;
exports.cloudinaryApiSecret = process.env.API_SECRET;
