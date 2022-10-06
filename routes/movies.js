const router = require('express').Router();

const { createMovie, getMovies, deleteMovieById } = require('../controllers/movies');
const { movieCreationCheck, movieDeleteCheck } = require('../utils/validation');

router.post('/movies', movieCreationCheck, createMovie);
router.get('/movies', getMovies);
router.delete('/movies/:movieId', movieDeleteCheck, deleteMovieById);

module.exports = router;
