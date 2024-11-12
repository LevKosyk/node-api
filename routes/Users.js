// routes/users.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Подключение к базе данных
const db = new sqlite3.Database('./db.sqlite');

// Получение всех пользователей
router.get('/', (req, res) => {
  db.all('SELECT * FROM users', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Регистрация нового пользователя
router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Поля email и password обязательны' });
  }
  
  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID, email });
  });
});

// Логин пользователя
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Поля email и password обязательны' });
  }

  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(401).json({ error: 'Неверный email или пароль' });
    }
    res.json({ id: user.id, email: user.email });
  });
});

// Обновление данных пользователя
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Поля email и password обязательны' });
  }

  db.run(
    'UPDATE users SET email = ?, password = ? WHERE id = ?',
    [email, password, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }
      res.json({ id, email });
    }
  );
});

// Удаление пользователя
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM users WHERE id = ?', [id], function (err) { // Передаем id как массив
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json({ message: 'Пользователь удален' });
  });
});

module.exports = router;
