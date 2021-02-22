const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const NotFoundError = require('../errorTypes/NotFoundError');
const BadRequestError = require('../errorTypes/BadRequestError');
const ConflictRequestError = require('../errorTypes/ConflictRequestError');
const AuthorizationError = require('../errorTypes/AuthorizationError');
const { JWT_SECRET } = require('../config');

// добавление пользователя
module.exports.createUser = (req, res, next) => {
  console.log(req.body);
  const {
    email,
    password,
    name,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictRequestError(`Пользователь ${email} уже зарегистрирован`);
      }
      return bcrypt.hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
        }));
    })
    .then((user) => {
      res.status(201).send({ email: user.email, id: user._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ data: token });
    })
    .catch(() => {
      next(new AuthorizationError('Неверные имя пользователя или пароль'));
    });
};

// запрос текущего пользователя
module.exports.getCurrentUser = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные'));
    }
    next(err);
  });

// обновление данных пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
