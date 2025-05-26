const { DataTypes } = require("sequelize");
const sequelize = require("../../../Saint (Final)/saint2/backend1/config/db");

const InstaSection = sequelize.define(
  "InstaSection",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
  },
  {
    tableName: "instasections",
    timestamps: true,
  }
);

module.exports = InstaSection;
