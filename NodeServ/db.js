const { Sequelize } = require('sequelize');

// Создание подключения к базе данных MySQL
const sequelize = new Sequelize('mysql://username:password@localhost:3306/database_name', {
  dialect: 'mysql',
  logging: false, // Отключаем логирование SQL-запросов
});

async function connect() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к базе данных успешно');
  } catch (error) {
    console.error('Не удалось подключиться к базе данных:', error);
  }
}

module.exports = { sequelize, connect };
