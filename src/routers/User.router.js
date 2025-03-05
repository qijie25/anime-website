const express = require('express');
const { login, register, updateProfile } = require("../models/User.model");
const { generateToken } = require("../middleware/jwtMiddleware");
const bcrypt = require('bcrypt');
const router = express.Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    console.log("User:", user);

    // req.session.userId = user.id;

    res.locals.id = user.id;
    res.locals.username = user.username;
    res.locals.email = user.email;

    // console.log("Session:", req.session);

    generateToken(req, res, () => {
      res.status(200).json({
        message: "Login successful",
        token: res.locals.token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    });
  } catch (err) {
    res.status(401).json({ message: err.message || "An error occurred during login" });
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await register(username, email, password);

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message || "An error occurred during registration" });
  }
});

router.put("/update-profile", async (req, res, next) => {
  try {
    const { id, username, password } = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const updatedFields = {};

    if (username) {
      updatedFields.name = username;
    }

    if (password) {
      updatedFields.password = await bcrypt.hash(password, 10); // Hash the password
    }

    const updatedPerson = await updateProfile(id, updatedFields);

    if (!updatedPerson) {
      return res.status(404).json({ message: "User not found or no changes made." });
    }

    res.status(200).json({ message: "Profile updated successfully", user: updatedPerson });
  } catch (err) {
    next(err);
  }
});

module.exports = router;