const { PORT = 3000 } = process.env;
const { MONGO_URL = 'mongodb://localhost:27017/moviesdb' } = process.env;
const { NODE_ENV } = process.env;
const JWT_SECRET = NODE_ENV !== 'production' ? 'dev-secret' : process.env;

module.exports = { PORT, MONGO_URL, JWT_SECRET };
