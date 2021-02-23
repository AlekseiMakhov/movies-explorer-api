const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const urlValidator = (value) => {
  if (!validator.isURL(value)) {
    throw new CelebrateError('Некорректный URL');
  }
  return value;
};

const passwordValidator = (value) => {
  if (value.match(/\s+/g)) {
    throw new CelebrateError('Некорректный пароль');
  }
  return value;
};

module.exports.movieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().custom(urlValidator).required(),
    trailer: Joi.string().custom(urlValidator).required(),
    thumbnail: Joi.string().custom(urlValidator).required(),
    owner: Joi.string().alphanum().length(24).hex(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

module.exports.idValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().alphanum().length(24).hex(),
  }),
});

module.exports.authorizeValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(passwordValidator).required().min(6),
  }),
});

module.exports.userValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(passwordValidator),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports.userUpdateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
});
