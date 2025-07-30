'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/database.json')[env];
const db = {};

// Инициализация Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], {
      ...config,
      dialectOptions: config.dialectOptions || {},
      logging: config.logging || false,
    })
  : new Sequelize(config.database, config.username, config.password, {
      ...config,
      dialectOptions: config.dialectOptions || {},
      logging: config.logging || console.log,
    });

// Проверка подключения
sequelize
  .authenticate()
  .then(() => console.log('Database connection established successfully.'))
  .catch((err) => console.error('Unable to connect to the database:', err));

// Определяем порядок загрузки моделей
const MODEL_LOAD_ORDER = [
  'User.js',
  'Category.js',
  'Place.js',
  'NotPlace.js',
  'Photo.js',
  'Like.js',
  'Booking.js',
];

// Загружаем модели в правильном порядке
MODEL_LOAD_ORDER.filter((file) => fs.existsSync(path.join(__dirname, file))).forEach(
  (file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  },
);

// Загружаем оставшиеся модели
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== basename &&
      file.endsWith('.js') &&
      !file.includes('.test.js') &&
      !MODEL_LOAD_ORDER.includes(file),
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Устанавливаем ассоциации
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

// Синхронизация для development
if (env === 'development') {
  sequelize
    .sync({ alter: true })
    .then(() => console.log('All models were synchronized successfully.'))
    .catch((err) => console.error('Error during synchronization:', err));
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
