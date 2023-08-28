const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports.inbox = sequelize.define("inbox", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  writter: {
    type: DataTypes.STRING,
    defaultValue: "Admin",
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
