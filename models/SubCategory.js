const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Category = require("./Category");

const SubCategory = sequelize.define(
  "subcategory",
  {
    sub_cate_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id",
      },
    },
    sub_cate_name: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    image: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
  },
  {
    tableName: "subcategory",
    timestamps: true,
  }
);
module.exports = SubCategory;
