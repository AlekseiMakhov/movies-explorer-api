const { badRequestErrorText, movieNotFoundErrorText, forbiddenErrorText } = require('../configs/errorTexts');
const BadRequestError = require('../errorTypes/BadRequestError');
const ForbiddenError = require('../errorTypes/ForbiddenError');
const NotFoundError = require('../errorTypes/NotFoundError');
const Movie = require('../models/Movie');

// добавление фильма
module.exports.addMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(badRequestErrorText);
      }
      return res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(badRequestErrorText));
      }
      next(err);
    });
};

// запрос всех добавленных фильмов
module.exports.getMovies = (req, res, next) => Movie.find({})
  .then((movie) => res.send(movie))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError(badRequestErrorText);
    }
    next(err);
  });

// удаление фильма из сохраненных
module.exports.deleteMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFoundErrorText);
      }
      return movie;
    })
    .then((movie) => {
      if (String(movie.owner) !== owner) {
        throw new ForbiddenError(forbiddenErrorText);
      }
      return Movie.findByIdAndRemove(req.params.id);
    })
    .then((movie) => res.send(movie))
    .catch(next);
};
