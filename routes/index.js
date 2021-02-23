const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { authorizeValidator, userValidator } = require('../middlewares/dataValidator');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errorTypes/NotFoundError');
const { pageNotFoundErrorText } = require('../configs/errorTexts');

router.post('/', authorizeValidator, login);
router.post('/', userValidator, createUser);
router.use('/', auth, userRouter);
router.use('/', auth, moviesRouter);

// Обработка запроса несуществующего адреса
router.all('*', (req, res, next) => next(new NotFoundError(pageNotFoundErrorText)));

module.exports = router;
