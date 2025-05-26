const { DataTypes } = require("sequelize");
const sequelize = require("../../../Saint (Final)/saint2/backend1/config/db");

const Video = sequelize.define(
  "Video",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "videos",
    timestamps: true,
  }
);

module.exports = Video;
