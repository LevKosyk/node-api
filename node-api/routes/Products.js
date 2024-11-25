// routes/products.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Подключение к базе данных
const db = new sqlite3.Database('./db.sqlite');

// Получить все продукты
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Создать новый продукт
router.post('/create', (req, res) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Все поля (name, description, price, category) обязательны' });
  }

  db.run(
    'INSERT INTO products (name, description, price, category) VALUES (?, ?, ?, ?)', 
    [name, description, price, category],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, description, price, category });
    }
  );
});

// Обновить продукт
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Все поля (name, description, price, category) обязательны' });
  }

  db.run(
    'UPDATE products SET name = ?, description = ?, price = ?, category = ? WHERE id = ?',
    [name, description, price, category, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Продукт не найден' });
      }
      res.json({ id, name, description, price, category });
    }
  );
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => { // db.get вместо db.run
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(row); // возвращаем один объект
  });
});



// Удалить продукт
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Продукт не найден' });
    }
    res.json({ message: 'Продукт удален' });
  });
});

module.exports = router;
