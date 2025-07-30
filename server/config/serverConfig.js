const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const config = (app) => {
  app.use(
    cors({
      origin: 'https://pskov-guide-git-main-annakryuchkovas-projects.vercel.app/', // URL вашего фронтенда
      credentials: true, // Разрешаем передачу кук
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Разрешенные методы
      allowedHeaders: ['Content-Type', 'Authorization'], // Разрешенные заголовки
    }),
  );
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));
  app.use(cookieParser());
};

module.exports = config;
