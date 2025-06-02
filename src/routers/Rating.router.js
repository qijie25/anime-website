/* eslint-disable consistent-return */
const express = require('express');
const {
  createRating,
  getRatingByAnimeId,
  getUserRatingForAnime,
} = require('../models/Rating.model');
const router = express.Router();

// Create or update rating for an anime
router.post('/', async (req, res, next) => {
  const { animeId, userId, score } = req.body;

  if (!animeId || !userId || score === null) {
    return res.status(400).json({ error: 'animeId, userId, and score are required.' });
  }

  try {
    const rating = await createRating(animeId, userId, score);
    res.json(rating);
  } catch (error) {
    next(error);
  }
});

// Get average and total rating for an anime
router.get('/:animeId', async (req, res, next) => {
  const { animeId } = req.params;
  try {
    const rating = await getRatingByAnimeId(parseInt(animeId));
    res.json(rating);
  } catch (error) {
    next(error);
  }
});

// Get a user's previous rating for a specific anime
router.get('/:userId/:animeId', async (req, res, next) => {
  const { userId, animeId } = req.params;

  try {
    const rating = await getUserRatingForAnime(parseInt(userId), parseInt(animeId));

    if (!rating) {
      return res.status(404).json({ message: 'No rating found for this anime by the user.' });
    }

    res.json(rating);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
