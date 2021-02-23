const { PORT = 3000 } = process.env;
const { NODE_ENV } = process.env;
const MONGO_URL = NODE_ENV !== 'production' ? 'mongodb://localhost:27017/moviesdb' : process.env;
const JWT_SECRET = NODE_ENV !== 'production' ? 'dev-secret' : process.env;

const MONGO_CFG = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

const LIMITER_CFG = {
  windowMs: 60 * 60 * 1000,
  max: 1000,
  message: 'Превышено количество запросов',
};

module.exports = {
  PORT, MONGO_URL, JWT_SECRET, MONGO_CFG, LIMITER_CFG,
};