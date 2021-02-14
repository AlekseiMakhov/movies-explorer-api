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

module.exports.cardValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(urlValidator).required(),
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
    password: Joi.string().required().custom(passwordValidator).min(6),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(100),
    avatar: Joi.string().custom(urlValidator),
  }),
});

module.exports.userUpdateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).required().max(30),
    about: Joi.string().min(2).required().max(100),
  }),
});

module.exports.avatarUpdateValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(urlValidator),
  }),
});
