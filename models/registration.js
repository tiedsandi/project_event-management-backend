const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Registration", registrationSchema);
