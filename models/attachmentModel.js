const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("attachment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  photo: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  krs: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  ktm: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
