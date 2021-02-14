const BadRequestError = require('../errorTypes/BadRequestError');
const ForbiddenError = require('../errorTypes/ForbiddenError');
const NotFoundError = require('../errorTypes/NotFoundError');
const Card = require('../models/Card');

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        throw new BadRequestError('Переданы некорректные данные');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

// запрос всех карточек
module.exports.getCards = (req, res, next) => Card.find({})
  .then((card) => res.send(card))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError('Запрос некорректен');
    }
    next(err);
  });

// удаление карточки
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки нет в базе');
      }
      return card;
    })
    .then((card) => {
      if (String(card.owner) !== owner) {
        throw new ForbiddenError('Недостаточно прав');
      }
      return Card.findByIdAndRemove(req.params.id);
    })
    .then((card) => res.send(card))
    .catch(next);
};
// лайк
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Такой карточки нет в базе');
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Запрос некорректен'));
    }
    next(err);
  });

// дизлайк
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.id,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Такой карточки нет в базе');
    }
    return res.send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('Запрос некорректен'));
    }
    next(err);
  });
