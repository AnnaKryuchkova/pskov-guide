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
    origin: 'https://pskov-guide.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'], // Добавьте это
  }),
);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

module.exports = app;
