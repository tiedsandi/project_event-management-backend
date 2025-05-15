var jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const logger = require("../utils/logger");

const UserModel = require("../models/user");
const { jwtSecret } = require("../config/env");

class UserController {
  async signUp(req, res) {
    try {
      const { name, email, password, role } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new UserModel({
        name,
        email,
        password: hashedPassword,
        role,
      });

      const savedUser = await user.save();

      const token = jwt.sign(
        {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
          name: savedUser.name,
        },
        jwtSecret,
        { expiresIn: "1d" }
      );

      res.status(201).json({
        message: "User registered and logged in",
        token: token,
      });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern.email) {
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
        role: user.role,
        name: user.name,
      },
      jwtSecret,
      { expiresIn: "1D" }
    );

    res.status(200).json({
      status: true,
      message: "Login successful",
      token: token,
    });
  }

  async getMe(req, res) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token not provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, jwtSecret);

      const { id, email, role, name } = decoded;
      return res.status(200).json({ id, email, role, name });
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }
}

module.exports = new UserController();
