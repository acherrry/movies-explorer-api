const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');

const BadRequestError = require('../errors/bad-request-err');

const urlCheck = (url) => {
  const urlConfirmation = isUrl(url);
  if (urlConfirmation) {
    return url;
  }
  throw new BadRequestError('Передайте корректный URL-адрес');
};

const userCreationCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
});

const userLoginCheck = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const userEditProfileCheck = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const movieCreationCheck = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlCheck),
    trailerLink: Joi.string().required().custom(urlCheck),
    thumbnail: Joi.string().required().custom(urlCheck),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const movieDeleteCheck = celebrate({
  body: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  userCreationCheck,
  userLoginCheck,
  userEditProfileCheck,
  movieCreationCheck,
  movieDeleteCheck,
};
