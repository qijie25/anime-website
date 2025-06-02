const express = require('express');
const path = require('path');
const router = express.Router();
const { ensureAdmin } = require('../middleware/adminMiddleware');

router.get('/', ensureAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../protected/admin.html'));
});

router.get('/anime-management', ensureAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../protected/animeManagement.html'));
});

router.get('/edit-anime', ensureAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../protected/editAnime.html'));
});

module.exports = router;
