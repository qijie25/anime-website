const express = require('express');
const { getAllAnimes, getAnimeById, getAnimeByGenre, updateAnime } = require("../models/Anime.model");
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

router.get('/genre/:genre', (req, res, next) => {
    const { genre } = req.params;
    const genreLower = genre.toLowerCase();

    getAnimeByGenre(genreLower)
    .then((animes) => res.status(200).json(animes))
    .catch(next);
});

router.put('/:id', (req, res, next) => {
    const { id } = req.params;
    const data = req.body;

    updateAnime(parseInt(id), data)
    .then((anime) => res.status(200).json(anime))
    .catch(next);
})

module.exports = router;