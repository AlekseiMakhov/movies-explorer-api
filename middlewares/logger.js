const winston = require('winston');
const expressWinston = require('express-winston');
const { requestLog, errorLog } = require('../configs/fileNames');

const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: requestLog }),
  ],
  format: winston.format.json(),
});

// логгер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: errorLog }),
  ],
  format: winston.format.json(),
});

module.exports = {
  requestLogger,
  errorLogger,
};
