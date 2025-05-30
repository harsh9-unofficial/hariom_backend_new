const { DataTypes } = require("sequelize");
const Sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Cart = require("./Cart");

const Wishlist = Sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    productId: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "id",
      },
    },
  },
  {
    tableName: "wishlist",
    timestamps: true,
  }
);
module.exports = Wishlist;
