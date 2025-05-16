const express = require("express");
const router = express.Router();

const {
  getEvents,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
  myEvents,
} = require("../controllers/eventController");
const {
  validateCreate,
  validateUpdate,
} = require("../middlewares/eventValidator");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", getEvents);
router.get("/my-events", protect, myEvents);
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  validateCreate,
  createEvent
);
router.get("/:id", getEventById);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  validateUpdate,
  updateEvent
);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Event management
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get paginated list of events
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page (default 6)
 *     responses:
 *       200:
 *         description: Paginated list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 page:
 *                   type: integer
 *                 total_pages:
 *                   type: integer
 *                 total_results:
 *                   type: integer
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *               - maximum
 *               - location
 *               - image
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               maximum:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event created
 *                 event:
 *                   $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request (e.g., missing image)
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get single event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event detail
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Event'
 *                 - type: object
 *                   properties:
 *                     register_count:
 *                       type: integer
 *                       description: Total number of registrations for this event
 *       400:
 *         description: Invalid ID or Event not found
 */

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Update an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               maximum:
 *                 type: string
 *               location:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Event updated
 *       404:
 *         description: Event not found
 *       500:
 *         description: Failed to update event
 */

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *       404:
 *         description: Event not found
 */

/**
 * @swagger
 * /events/my-events:
 *   get:
 *     summary: Get events based on user role (admin sees created events, user sees registered events)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of events based on user role
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
