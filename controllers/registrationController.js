const Event = require("../models/event");

const Registration = require("../models/registration");

class Registeration {
  async getRegistration(req, res) {
    const eventId = req.params.eventId;

    const registrations = await Registration.find({ event: eventId })
      .populate("user")
      .lean()
      .exec();

    res.status(200).json({ success: true, data: registrations });
  }

  async registerEvent(req, res) {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const currentRegistrations = await Registration.countDocuments({
      event: eventId,
    });

    if (currentRegistrations >= parseInt(event.maximum)) {
      return res
        .status(400)
        .json({ message: "Event is full, no more registrations allowed" });
    }

    const existing = await Registration.findOne({
      user: userId,
      event: eventId,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    const registration = new Registration({
      user: userId,
      event: eventId,
    });
    await registration.save();

    res.status(201).json({ message: "Registered successfully", registration });
  }

  async cancelRegistration(req, res) {
    const userId = req.user.id;
    const eventId = req.params.eventId;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
    });
    if (!registration) {
      return res
        .status(404)
        .json({ message: "No active registration found for this event" });
    }

    await Registration.findByIdAndDelete(registration._id);

    res.status(200).json({ message: "Registration cancelled successfully" });
  }
}

module.exports = new Registeration();
