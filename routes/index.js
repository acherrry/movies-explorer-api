const router = require('express').Router();

const NotFoundError = require('../errors/not-found-err');
const { userCreationCheck, userLoginCheck } = require('../utils/validation');
const { createUser, login, loginOut } = require('../controllers/users');
const auth = require('../middlewares/auth');

const userRouter = require('./users');
const movieRouter = require('./movies');

router.post('/signup', userCreationCheck, createUser);
router.post('/signin', userLoginCheck, login);
router.delete('/signout', loginOut);

router.use(auth);

router.use(userRouter);
router.use(movieRouter);

router.use((req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
