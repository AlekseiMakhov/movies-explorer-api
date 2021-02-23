const mongoose = require('mongoose');
const validator = require('validator');
const { badURLErrorText } = require('../configs/errorTexts');

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
      message: badURLErrorText,
    },
    required: true,
  },
  trailer: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: badURLErrorText,
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      message: badURLErrorText,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
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
