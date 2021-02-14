const router = require('express').Router();
const {
  getUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const {
  userValidator, idValidator, userUpdateValidator, avatarUpdateValidator,
} = require('../middlewares/dataValidator');

router.get('/users', getUsers);
router.get('/users/me', userValidator, getCurrentUser);
router.get('/users/:id', idValidator, getUser);
router.patch('/users/me', userUpdateValidator, updateUser);
router.patch('/users/me/avatar', avatarUpdateValidator, updateAvatar);

module.exports = router;
