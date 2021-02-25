const { tooManyReqErrorText } = require('./errorTexts');

require('dotenv').config();

const { PORT = 3000 } = process.env;
const { NODE_ENV } = process.env;
const MONGODB_URI = NODE_ENV !== 'production' ? 'mongodb://localhost:27017/moviesdb' : process.env.MONGODB_URI;
const JWT_SECRET = NODE_ENV !== 'production' ? 'dev-secret' : process.env.JWT_SECRET;

const MONGO_CFG = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const LIMITER_CFG = {
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: tooManyReqErrorText,
};

module.exports = {
  PORT, MONGODB_URI, JWT_SECRET, MONGO_CFG, LIMITER_CFG,
};
