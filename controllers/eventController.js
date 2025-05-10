const mongoose = require("mongoose");

const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");
const Event = require("../models/event");
const { extractPublicIdFromUrl } = require("../utils/extractPublicId");

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

  async getEventById(req, res) {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Event ID format" });
    }

    const event = await Event.findById(id).lean().exec();

    if (!event) {
      res.status(400).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  }

  async updateEvent(req, res) {
    const id = req.params.id;

    try {
      const { title, description, date, maximum, location } = req.body;
      const event = await Event.findById(id);

      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      let imageUrl = event.imageUrl;

      if (req.file) {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          await deleteFromCloudinary(publicId);
        }

        const result = await uploadToCloudinary(
          req.file.buffer,
          Date.now().toString()
        );
        imageUrl = result.secure_url;
      }

      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.maximum = maximum || event.maximum;
      event.location = location || event.location;
      event.imageUrl = imageUrl;

      const updatedEvent = await event.save();

      res.status(200).json({ message: "Event updated", event: updatedEvent });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Failed to update event", error: error.message });
    }
  }

  async deleteEvent(req, res) {
    const id = req.params.id;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const publicId = extractPublicIdFromUrl(event.imageUrl);

    await deleteFromCloudinary(publicId);
    await Event.findByIdAndDelete(id);

    res.status(200).json({ message: "Event deleted successfully" });
  }
}

module.exports = new EventController();
