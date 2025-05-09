const express = require("express");
const router = express.Router();

const ctl = require("../controllers/userController");
const {
  validateSignUp,
  validateLogin,
} = require("../middlewares/userValidator");

router.post("/signup", validateSignUp, ctl.signUp);
router.post("/login", validateLogin, ctl.login);
// router.post("/forgot-password", ctl.changePassword);

module.exports = router;
