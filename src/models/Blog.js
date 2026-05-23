const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConnection");

class Blog extends Model {}

Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    author: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    year_written: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isGreaterThanToday(value) {
          if (value > new Date().getFullYear()) {
            throw new Error("Date can't be in the future");
          }
        },
        isNotBefore1991(value) {
          if (value < 1991) {
            throw new Error("Date can't be prior to 1991");
          }
        },
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
  },
  { sequelize, tableName: "blogs", timestamps: true, underscored: true },
);

module.exports = Blog;
