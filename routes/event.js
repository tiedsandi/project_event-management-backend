const express = require("express");
const router = express.Router();

const { getEvents, createEvent } = require("../controllers/eventController");
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
// router.put("/:id", adminOnly, updateEvent);
// router.delete("/:id", adminOnly, deleteEvent);

module.exports = router;
