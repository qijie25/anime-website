const express = require('express');
const { getAllAnimes, getAnimeById } = require("../models/Anime.model");
const router = express.Router();

router.get('/', (req, res, next) => {
    getAllAnimes()
    .then((animes) => res.status(200).json(animes))
    .catch(next);
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    getAnimeById(id)
     .then((animes) => res.status(200).json(animes))
     .catch(next);
});

module.exports = router;