const router = require('express').Router();
const {
  updateUser, getCurrentUser,
} = require('../controllers/users');
const { userUpdateValidator } = require('../middlewares/dataValidator');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', userUpdateValidator, updateUser);

module.exports = router;
