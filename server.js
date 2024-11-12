// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3005;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./db.sqlite', (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
  } else {
    console.log('Подключено к базе данных SQLite.');
  }
});
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  password TEXT NOT NULL
)`);
const userRoutes = require('./routes/Users');
app.use('/api/users', userRoutes);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
