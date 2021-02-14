const router = require('express').Router();
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');
const { userValidator, userUpdateValidator } = require('../middlewares/dataValidator');

router.get('/users/me', userValidator, getCurrentUser);
router.put('/users/me', userUpdateValidator, updateUser);

module.exports = router;
