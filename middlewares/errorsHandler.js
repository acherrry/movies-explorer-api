const errorsHandler = ((err, req, res, next) => {
  if (err.statusCode === undefined) {
    const { statusCode = 500, message } = err;
    return res.status(statusCode).send({
      message: statusCode === 500
        ? 'Внутренняя ошибка сервера'
        : message,
    });
  }
  next();
  return res.status(err.statusCode).send({ message: err.message });
});

module.exports = errorsHandler;
