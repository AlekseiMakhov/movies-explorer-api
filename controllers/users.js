const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const NotFoundError = require('../errorTypes/NotFoundError');
const BadRequestError = require('../errorTypes/BadRequestError');
const ConflictRequestError = require('../errorTypes/ConflictRequestError');
const AuthorizationError = require('../errorTypes/AuthorizationError');

const { NODE_ENV, JWT_SECRET } = process.env;

// добавление пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name = 'Жак-Ив Кусто',
    about = 'Исследователь',
    avatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
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
          about,
          avatar,
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
        { _id: user._id },
        NODE_ENV === 'production'
          ? JWT_SECRET
          : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ data: token });
    })
    .catch(() => {
      next(new AuthorizationError('Неверные имя пользователя или пароль'));
    });
};

// запрос всех пользователей
module.exports.getUsers = (req, res, next) => User.find({})
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Ошибка запроса пользователей'));
    }
    next(err);
  });

// запрос пользователя по id
module.exports.getUser = (req, res, next) => User.findById(req.params.id)
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
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true })
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

// обновление аватара
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
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
