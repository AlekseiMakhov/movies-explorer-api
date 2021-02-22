const router = require('express').Router();
const { addMovie, deleteMovie, getMovies } = require('../controllers/movies');
const { movieValidator, idValidator } = require('../middlewares/dataValidator');

router.post('/', movieValidator, addMovie);
router.get('/', getMovies);
router.delete('/:movieId', idValidator, deleteMovie);

module.exports = router;
