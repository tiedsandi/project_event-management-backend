const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    maximum: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    is_active: { type: Number, enum: [0, 1], default: 1 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", eventSchema);
