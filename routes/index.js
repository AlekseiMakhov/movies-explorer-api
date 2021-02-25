const router = require('express').Router();
const userRouter = require('./users');
const moviesRouter = require('./movies');
const { authorizeValidator, userValidator } = require('../middlewares/dataValidator');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errorTypes/NotFoundError');
const { pageNotFoundErrorText } = require('../configs/errorTexts');

router.post('/signin', authorizeValidator, login);
router.post('/signup', userValidator, createUser);
router.use('/', auth, userRouter);
router.use('/', auth, moviesRouter);

// Обработка запроса несуществующего адреса
router.all('*', auth, (req, res, next) => next(new NotFoundError(pageNotFoundErrorText)));

module.exports = router;
