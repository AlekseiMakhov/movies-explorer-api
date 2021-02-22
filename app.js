require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const { RateLimiter } = require('limiter').RateLimiter;
const cors = require('cors');
const { errors } = require('celebrate');
const userRouter = require('./routes/users.js');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users.js');
const NotFoundError = require('./errorTypes/NotFoundError.js');
const { errorLogger, requestLogger } = require('./middlewares/logger.js');
const { authorizeValidator, userValidator } = require('./middlewares/dataValidator.js');
const { PORT, MONGO_URL } = require('./config');

const app = express();

connect(MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const limiter = new RateLimiter(150, 'hour');

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(limiter);

app.post('/signin', authorizeValidator, login);
app.post('/signup', userValidator, createUser);
app.use('/', auth, userRouter);
app.use('/', moviesRouter);

// Обработка запроса несуществующего адреса
app.all('*', (req, res, next) => next(new NotFoundError('Ресурс не найден')));

app.use(errorLogger);
app.use(errors());

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res
    .status(status)
    .send({
      message: status === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT);
