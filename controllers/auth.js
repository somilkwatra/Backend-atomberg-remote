const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "Somil123";

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Please check your email and password and then try again",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      email: user.email,
      id: user._id,
    });

    res.json({
      result: {
        name: user.name,
        email: user.email,
        apiKey: user.apiKey,
        refreshToken: user.refreshToken,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { name, email, password, apiKey, refreshToken } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      apiKey,
      refreshToken,
    });

    await newUser.save();

    const token = generateToken({
      email: newUser.email,
      id: newUser._id,
    });

    res.status(201).json({
      result: {
        name: newUser.name,
        email: newUser.email,
        apiKey: newUser.apiKey,
        refreshToken: newUser.refreshToken,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, secret, {
    expiresIn: "24h",
  });
};

const validateToken = (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token is required." });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ valid: false });
    }
    res.status(200).json({ valid: true, decoded });
  });
};

module.exports = { login, register, validateToken };
