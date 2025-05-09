var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

const UserModel = require("../models/user");

class UserController {
  async signUp(req, res) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      const user = new UserModel({
        email: req.body.email,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      res.status(201).json({ message: "User registered", user: savedUser });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.email) {
        // logger.error({ error }, "Error detail");
        return res.status(400).json({ message: "Email has used" });
      }
      logger.error({ error }, "Error detail");
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async login(req, res) {
    let { email, password } = req.body;

    let user = await UserModel.findOne({ email: email });

    if (user == undefined) {
      return res.status(404).json({
        status: false,
        message: "Email not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1D" }
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
    });
  }
}

module.exports = new UserController();
