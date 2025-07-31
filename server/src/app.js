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
app.options('*', cors());
app.use(
  cors({
    origin: [
      'https://pskov-guide.vercel.app',
      'http://localhost:3000', // для разработки
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie'], // Добавьте это
  }),
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

module.exports = app;
