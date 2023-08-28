const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports.progress = sequelize.define("progress", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  progress: {
    type: DataTypes.STRING,
    defaultValue: "unpaid",
    allowNull: false,
  },
});
