const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("bio", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  nama_lengkap: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nama_panggilan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jenis_kelamin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nim: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  nia: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  sekolah_asal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_hp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fakultas: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  program_studi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  motivasi_bergabung: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  alasan_memilih: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  alasan_dipilih: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  software: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
