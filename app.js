require('dotenv').config();
const express = require('express');
const { connect } = require('mongoose');
const limiter = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const {
  PORT, MONGO_URL, MONGO_CFG, LIMITER_CFG,
} = require('./configs/constants');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./routes/index');

const app = express();

app.use(cors());
connect(MONGO_URL, MONGO_CFG);

app.use(express.json());
app.use(requestLogger);
app.use(helmet());
app.use(limiter(LIMITER_CFG));

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
