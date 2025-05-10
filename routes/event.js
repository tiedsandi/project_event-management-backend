const express = require("express");
const router = express.Router();

const {
  getEvents,
  createEvent,
  getEventById,
} = require("../controllers/eventController");
const { validateCreate } = require("../middlewares/eventValidator");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", getEvents);
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validateCreate,
  createEvent
);
router.get("/:id", getEventById);
// router.put("/:id", protect, adminOnly, updateEvent);
// router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;
