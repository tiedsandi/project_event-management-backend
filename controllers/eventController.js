const { uploadToCloudinary } = require("../config/cloudinary");
const Event = require("../models/event");

class EventController {
  async getEvents(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDatas = await Event.countDocuments().exec();
    const datas = await Event.find()
      // .select("name price _id createdAt productImage updatedAt")
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    res.status(200).json({
      page: page,
      results: datas,
      total_pages: Math.ceil(totalDatas / limit),
      total_results: totalDatas,
    });
  }

  async createEvent(req, res) {
    try {
      const { title, description, date, maximum, location } = req.body;

      if (!req.file) {
        return res.status(400).json({ error: "Image file is required" });
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        Date.now().toString()
      );
      const imageUrl = result.secure_url;

      const event = new Event({
        title,
        description,
        date,
        maximum,
        location,
        imageUrl,
      });

      await event.save();

      res.status(201).json({ message: "Event created", event });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new EventController();
