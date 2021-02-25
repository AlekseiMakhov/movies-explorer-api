const { serverErrorText } = require('../configs/errorTexts');

const errorHandler = (err, req, res, next) => {
  const { status = 500, message } = err;
  res
    .status(status)
    .send({
      message: status === 500
        ? serverErrorText
        : message,
    });
  next();
};

module.exports = errorHandler;
