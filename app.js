const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000, MONGODB = 'mongodb://localhost:27017/moviesdb' } = process.env;
const routes = require('./routes');

const errorsHandler = require('./middlewares/errorsHandler');

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: 'https://movies-chernyadeva.nomoredomains.icu',
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);

async function main() {
  await mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
