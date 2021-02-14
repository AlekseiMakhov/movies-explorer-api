const BadRequestError = require('../errorTypes/BadRequestError');
const ForbiddenError = require('../errorTypes/ForbiddenError');
const NotFoundError = require('../errorTypes/NotFoundError');
const Movie = require('../models/Movie');

// добавление фильма
module.exports.addMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

// запрос всех добавленных фильмов
module.exports.getCards = (req, res, next) => Movie.find({})
  .then((movie) => res.send(movie))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Запрос некорректен');
    }
    next(err);
  });

// удаление фильма из сохраненных
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Такого фильма нет в базе');
      }
      return movie;
    })
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new ForbiddenError('Недостаточно прав');
      }
      return Movie.findByIdAndRemove(req.params.movieId);
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
