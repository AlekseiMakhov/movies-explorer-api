const router = require('express').Router();
const { addMovie, deleteMovie, getMovies } = require('../controllers/movies');
const { movieValidator, idValidator } = require('../middlewares/dataValidator');

router.post('/movies', movieValidator, addMovie);
router.get('/movies', getMovies);
router.delete('/movies/:id', idValidator, deleteMovie);

module.exports = router;
