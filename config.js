const { PORT = 3000 } = process.env;
const MONGO_URL = 'mongodb://localhost:27017/moviesdb';
const { NODE_ENV } = process.env;
const JWT_SECRET = NODE_ENV !== 'production' ? 'dev-secret' : process.env;
const MONGO_CFG = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const LIMITER_CFG = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Превышено количество запросов',
};

module.exports = {
  PORT, MONGO_URL, JWT_SECRET, MONGO_CFG, LIMITER_CFG,
};
