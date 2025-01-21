const express = require('express');
const bodyParser = require('body-parser');
const { connect } = require('./db');
const Product = require('./models/product');

// Инициализация приложения Express
const app = express();
app.use(bodyParser.json());

// Подключение к базе данных
connect();

// Получение всех продуктов
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).send('Ошибка при получении продуктов');
  }
});

// Получение продукта по id
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Продукт не найден');
    }
    res.json(product);
  } catch (error) {
    res.status(500).send('Ошибка при получении продукта');
  }
});

// Создание нового продукта
app.post('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price) {
      return res.status(400).send('Не все данные для продукта указаны');
    }
    const newProduct = await Product.create({ name, price });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send('Ошибка при создании продукта');
  }
});

// Обновление продукта
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Продукт не найден');
    }

    const { name, price } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).send('Ошибка при обновлении продукта');
  }
});

// Удаление продукта
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).send('Продукт не найден');
    }

    await product.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Ошибка при удалении продукта');
  }
});

// Запуск сервера
const port = 3000;
app.listen(port, () => {
  console.log(`Сервер работает на порту ${port}`);
});
