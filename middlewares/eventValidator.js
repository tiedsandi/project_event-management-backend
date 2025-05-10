const { check, validationResult } = require("express-validator");

exports.validateCreate = [
  check("date")
    .isDate()
    .withMessage("Invalid date format")
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      const minDate = new Date(today.setDate(today.getDate() + 3)); // +3 hari dari hari ini

      if (eventDate < minDate) {
        throw new Error("Event date must be at least 3 days from today");
      }
      return true;
    }),
  check("title").notEmpty().withMessage("Title is required"),
  check("location").notEmpty().withMessage("Location is required"),
  check("maximum")
    .isInt({ min: 5 })
    .withMessage(
      "Maximum must be an integer, at least 5, and cannot be negative"
    ),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!req.file) {
      errors.errors.push({ param: "image", msg: "Image file is required" });
    } else {
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedTypes.includes(req.file.mimetype)) {
        errors.errors.push({
          param: "image",
          msg: "Invalid image format (jpg, jpeg, png only)",
        });
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        errors.errors.push({
          param: "image",
          msg: "Image size must be under 5MB",
        });
      }
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
