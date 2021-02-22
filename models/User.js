const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { loginErrorText } = require('../configs/errorTexts');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Некорректный Email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(loginErrorText));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(loginErrorText));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
