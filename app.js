// require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const limiter = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const NotFoundError = require('./errorTypes/NotFoundError');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { authorizeValidator, userValidator } = require('./middlewares/dataValidator');
const {
  PORT, MONGO_URL, MONGO_CFG, LIMITER_CFG,
} = require('./config');

const app = express();

app.use(cors());
connect(MONGO_URL, MONGO_CFG);

app.use(express.json());

app.use(requestLogger);

app.use(helmet());
// app.use(limiter(LIMITER_CFG));

app.post('/signin', authorizeValidator, login);
app.post('/signup', userValidator, createUser);
app.use('/users', auth, userRouter);
app.use('/movies', auth, moviesRouter);

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
