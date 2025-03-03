const express = require('express');
const { login } = require("../models/User.model");
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

module.exports = router;