const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

// Определяем модель продукта
const Product = sequelize.define('Product', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

module.exports = Product;
