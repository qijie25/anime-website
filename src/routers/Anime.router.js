const express = require('express');
const {
  getAllAnimes,
  getAnimeById,
  getAnimeByGenre,
  updateAnime,
  getAnimeByQuery,
  createAnime,
  deleteAnime,
  getAnimeByStatus,
  getFilteredAnimes,
  getTopRatedAnimes,
} = require('../models/Anime.model');
const animeUpload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.get('/', (req, res, next) => {
  getAllAnimes()
    .then((animes) => res.status(200).json(animes))
    .catch(next);
});

router.get('/search', async (req, res, next) => {
  try {
    const { query, type, status, limit } = req.query;
    const animes = await getAnimeByQuery({
      query,
      type,
      status,
      limit: limit ? parseInt(limit) : null,
    });
    res.status(200).json(animes);
  } catch (error) {
    next(error);
  }
});

router.get('/top-rated', async (req, res, next) => {
  try {
    const animes = await getTopRatedAnimes(10);
    res.status(200).json(animes);
  } catch (error) {
    next(error);
  }
});

router.get('/genre/:genre', (req, res, next) => {
  const { genre } = req.params;
  const genreLower = genre.toLowerCase();

  getAnimeByGenre(genreLower)
    .then((animes) => res.status(200).json(animes))
    .catch(next);
});

router.get('/status/:status', (req, res, next) => {
  const { status } = req.params;
  getAnimeByStatus(status)
    .then((animes) => res.status(200).json(animes))
    .catch(next);
});

router.get('/filter', async (req, res, next) => {
  try {
    const { genres, year, type, status } = req.query;

    let genreList = [];
    if (Array.isArray(genres)) {
      genreList = genres.map((g) => g.trim().toLowerCase());
    } else if (typeof genres === 'string') {
      genreList = genres.split(',').map((g) => g.trim().toLowerCase());
    }

    let yearList = [];
    if (Array.isArray(year)) {
      yearList = year.map((y) => parseInt(y));
    } else if (typeof year === 'string') {
      yearList = year.split(',').map((y) => parseInt(y));
    }

    const animes = await getFilteredAnimes({ genreList, yearList, type, status });
    res.status(200).json(animes);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  getAnimeById(id)
    .then((animes) => res.status(200).json(animes))
    .catch(next);
});

router.post('/', animeUpload.single('image'), async (req, res, next) => {
  try {
    const animeData = req.body;
    const imageUrl = req.file?.path || null; // cloudinary URL

    const newAnime = await createAnime(animeData, imageUrl);
    res.status(201).json(newAnime);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', animeUpload.single('image'), async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;
  const file = req.file;
  const dateAired = req.body.date_aired;
  const parsedDate = dateAired ? new Date(dateAired) : null;

  data.date_aired = parsedDate;

  try {
    if (file) {
      data.image = file.path;
    }

    const updatedAnime = await updateAnime(parseInt(id), data);
    res.status(200).json(updatedAnime);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedAnime = await deleteAnime(parseInt(id));
    res.status(200).json(deletedAnime);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
