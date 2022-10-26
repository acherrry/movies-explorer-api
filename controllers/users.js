const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const NotFoundError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const { OK, CREATED } = require('../utils/constants');

const createUser = async (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new ConflictError('При регистрации указан email, который занял другой пользователь');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      email, password: hashedPassword, name,
    });
    return res.status(CREATED).send({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Передан неверный email или пароль');
    }
    const comparablePassword = await bcrypt.compare(password, user.password);
    if (!comparablePassword) {
      throw new UnauthorizedError('Передан неверный email или пароль');
    }
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'jwt-secret');

    res.cookie('jwt', token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'none',
      secure: true,
    });
    return res.status(OK).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные для авторизации'));
    }
    return next(err);
  }
};

const loginOut = async (req, res) => res.status(200).clearCookie('jwt', {
  httpOnly: true,
  sameSite: 'none',
  secure: true,
}).send();

const getCurrentUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('Пользователь по указанному ID не найден');
    }
    return res.status(OK).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Невалидные переданные данные'));
    }
    return next(err);
  }
};

const editProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { email, name } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new ConflictError('При обновлении указан email, который занял другой пользователь');
    }
    const renewedUser = await User
      .findByIdAndUpdate(userId, { email, name }, { new: true, runValidators: true });
    if (!renewedUser) {
      throw new NotFoundError('Пользователь с указанным ID не найден');
    }
    return res.status(OK).send({
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
    }
    if (err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный ID'));
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  loginOut,
  getCurrentUser,
  editProfile,
};
