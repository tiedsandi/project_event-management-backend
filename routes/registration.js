const express = require("express");
const router = express.Router();
const {
  registerEvent,
  cancelRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:eventId/register", protect, registerEvent);
router.post("/:eventId/cancel", protect, cancelRegistration);

module.exports = router;
