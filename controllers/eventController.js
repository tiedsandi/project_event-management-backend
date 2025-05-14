const mongoose = require("mongoose");

const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../config/cloudinary");
const Event = require("../models/event");
const Registration = require("../models/registration");
const { extractPublicIdFromUrl } = require("../utils/extractPublicId");

class EventController {
  async getEvents(req, res) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const today = new Date();

    // const totalDatas = await Event.countDocuments().exec();
    const datas = await Event.find()
      // .select("name price _id createdAt productImage updatedAt")
      // .skip(skip)
      // .limit(limit)
      .lean();
    // .exec();

    const eventIds = datas.map((event) => event._id);

    const registrations = await Registration.aggregate([
      { $match: { event: { $in: eventIds } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
    ]);

    const registrationCountMap = {};
    registrations.forEach((reg) => {
      registrationCountMap[reg._id.toString()] = reg.count;
    });

    const eventsWithCount = datas.map((event) => ({
      ...event,
      register_count: registrationCountMap[event._id.toString()] || 0,
    }));

    const sortedEvents = [...eventsWithCount].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      const isPastA = dateA < today;
      const isPastB = dateB < today;

      if (isPastA !== isPastB) {
        return isPastA ? 1 : -1; // yang lewat ke belakang
      }

      return dateA - dateB;
    });

    const totalDatas = sortedEvents.length;
    const paginated = sortedEvents.slice(skip, skip + limit);

    res.status(200).json({
      page: page,
      total_pages: Math.ceil(totalDatas / limit),
      total_results: totalDatas,
      results: paginated,
    });
  }

  async createEvent(req, res) {
    try {
      const userId = req.user.id;
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
        created_by: userId,
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

    const registrationCount = await Registration.countDocuments({ event: id });
    const eventWithCount = {
      ...event,
      register_count: registrationCount,
    };

    res.status(200).json(eventWithCount);
  }

  async updateEvent(req, res) {
    const id = req.params.id;
    const userId = req.user.id;
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
      event.created_by = userId;

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
