/* eslint-disable consistent-return */
const express = require('express');
const {
  login,
  register,
  updateProfile,
  verifyCurrentPassword,
  updateProfilePicture,
  getUserProfilePictures,
} = require('../models/User.model');
const { generateToken } = require('../middleware/jwtMiddleware');
const upload = require('../middleware/uploadMiddleware');
const bcrypt = require('bcrypt');
const prisma = require('../models/prismaClient');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    if (!user) throw new Error('Invalid credentials');

    req.session.user_id = user.id;

    const isAdmin = await prisma.admin.findUnique({
      where: { user_id: user.id },
    });

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: !!isAdmin,
    };

    // Populate res.locals for token generation
    res.locals.id = user.id;
    res.locals.username = user.username;
    res.locals.email = user.email;

    generateToken(req, res, () =>
      res.status(200).json({
        message: 'Login successful',
        token: res.locals.token,
        user: req.session.user,
      }),
    );
  } catch (err) {
    return res.status(401).json({ message: err.message || 'An error occurred during login' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await register(username, email, password);

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message || 'An error occurred during registration' });
  }
});

router.put('/update-profile', async (req, res, next) => {
  try {
    const { id, username, currentPassword, newPassword } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Verify the current password
    const isCurrentPasswordValid = await verifyCurrentPassword(id, currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const updatedFields = {};

    if (username) {
      updatedFields.username = username;
    }

    if (newPassword) {
      updatedFields.password = await bcrypt.hash(newPassword, 10); // Hash the new password
    }

    const updatedPerson = await updateProfile(id, updatedFields);

    if (!updatedPerson) {
      return res.status(404).json({ message: 'User not found or no changes made.' });
    }

    res.status(200).json({ message: 'Profile updated successfully', user: updatedPerson });
  } catch (err) {
    next(err);
  }
});

// Upload new profile picture
router.post('/upload-profile-picture/:id', upload.single('image'), async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const imageUrl = req.file.path;

    const updatedUser = await updateProfilePicture(userId, imageUrl);
    res.status(200).json({ message: 'Profile picture uploaded successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all profile pictures of a user
router.get('/profile-pictures/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const pictures = await getUserProfilePictures(userId);
    res.status(200).json({ pictures });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
