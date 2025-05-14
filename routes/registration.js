const express = require("express");
const router = express.Router();
const {
  registerEvent,
  cancelRegistration,
  getRegistration,
} = require("../controllers/registrationController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/:eventId/register", protect, registerEvent);
router.post("/:eventId/cancel", protect, cancelRegistration);
router.get("/:eventId", protect, getRegistration);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Registrations
 *   description: Event registration management
 */

/**
 * @swagger
 * /registration/{eventId}/register:
 *   post:
 *     summary: Register user for an event
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID to register for
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 registration:
 *                   $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Event full or already registered
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /registration/{eventId}/cancel:
 *   post:
 *     summary: Cancel event registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: The event ID to cancel registration for
 *     responses:
 *       200:
 *         description: Registration cancelled successfully
 *       404:
 *         description: No active registration found
 */
