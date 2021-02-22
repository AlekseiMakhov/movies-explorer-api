const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Некорректный URL',
    },
    required: true,
  },
  trailer: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Некорректный URL',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: 'Некорректный URL',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
