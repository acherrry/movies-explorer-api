const Movie = require('../models/movie');

const { OK, CREATED } = require('../utils/constants');

const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/conflict-err');
const ForbiddenError = require('../errors/conflict-err');

const createMovie = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const movie = await Movie.create({
      owner: userId,
      ...req.body,
    });
    return res.status(CREATED).send(movie);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные для создания фильма'));
    }
    return next(err);
  }
};

const getMovies = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const movies = await Movie.find({ owner: userId });
    if (movies.length === 0) {
      throw new NotFoundError('У вас нет сохраненных фильмов');
    }
    return res.status(OK).send(movies);
  } catch (err) {
    return next(err);
  }
};

const deleteMovieById = async (req, res, next) => {
  const userId = req.user._id;
  const { movieId } = req.params;
  try {
    const movie = await Movie.findById(movieId);
    if (!movie) {
      throw new NotFoundError('Фильм с указанным ID не найден');
    }
    const movieUserId = movie.owner;
    const movieUserIdString = movieUserId.toString();
    if (userId !== movieUserIdString) {
      throw new ForbiddenError('Удалить фильм, созданный не Вами, невозможно');
    }
    await Movie.deleteMany(movie);
    return res.status(OK).send(movie);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Невалидные переданные данные для удаления фильма'));
    }
    return next(err);
  }
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovieById,
};
