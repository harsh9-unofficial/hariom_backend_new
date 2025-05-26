const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PromoBanner = sequelize.define('PromoBanner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  buttonText: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Shop Deals',
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'promo_banners',
  timestamps: true,
});

module.exports = PromoBanner;