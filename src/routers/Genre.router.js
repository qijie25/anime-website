const express = require('express');
const { getAllGenres } = require('../models/Genre.model');
const router = express.Router();

router.get('/', (req, res, next) => {
  getAllGenres()
    .then((genres) => res.status(200).json(genres))
    .catch(next);
});

module.exports = router;
