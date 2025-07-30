// Фреймворк веб-приложений.
const express = require('express');
// Логгирование деталей запросов.
const morgan = require('morgan');
const cors = require('cors');

// Импорт маршрутов.
const entriesRouter = require('./routes/entries.routes');

const app = express();
const config = require('../config/serverConfig');
app.use('/uploads', express.static('uploads'));
config(app);

app.use(express.json());
app.use(morgan('dev'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', entriesRouter);
app.use(
  cors({
    origin: ['https://your-frontend-url.vercel.app'],
  }),
);

module.exports = app;
