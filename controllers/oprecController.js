const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const progressModel = require("../models/progresModel");
const biodataModel = require("../models/biodataModel");
const attachmentModel = require("../models/attachmentModel");

progressModel.progress
  .sync({ force: false })
  .then(() => console.log("progress table synced"))
  .catch((err) => {
    console.error("error syncing progress table:", err);
  });

biodataModel
  .sync({ force: false })
  .then(() => console.log("progress table synced"))
  .catch((err) => {
    console.error("error syncing progress table:", err);
  });

attachmentModel
  .sync({ force: false })
  .then(() => console.log("attachment table synced"))
  .catch((err) => {
    console.error("error syncing attachment table:", err);
  });

module.exports.getProgress = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userProgress = await progressModel.progress.findByPk(decoded.user.id);
  if (!userProgress) {
    res.status(200).json({});
  }
  const payload = {
    id: userProgress.id,
    progress: userProgress.progress,
  };
  res.status(200).json(payload);
};

module.exports.getBio = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const userBio = await biodataModel.findByPk(decoded.user.id);
    if (userBio === null) {
      res.status(200).json({ msg: `User ${decoded.user.id} not found` });
      return;
    }
    const payload = {
      id: userBio.id,
      nama_lengkap: userBio.nama_lengkap,
      nama_panggilan: userBio.nama_panggilan,
      jenis_kelamin: userBio.jenis_kelamin,
      nim: userBio.nim,
      nia: userBio.nia,
      sekolah_asal: userBio.sekolah_asal,
      alamat: userBio.alamat,
      nomor_hp: userBio.nomor_hp,
      fakultas: userBio.fakultas,
      program_studi: userBio.program_studi,
      motivasi: userBio.motivasi_bergabung,
      alasan_bergabung: userBio.alasan_memilih,
      rencana_kedepannya: userBio.alasan_dipilih,
      software: userBio.software,
    };
    res.status(200).json(payload);
  } catch {
    res.status(500).json({ msg: "internal server error" });
  }
};

module.exports.attachment = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  await sequelize.transaction(async (t) => {
    const attachment = await attachmentModel.create(
      {
        id: decoded.user.id,
        photo: req.files.photo[0].path,
        krs: req.files.krs[0].path,
        ktm: req.files.ktm[0].path,
      },
      { transaction: t }
    );
  });
  res.status(200).json({ msg: "file upload success" });
};

module.exports.setBio = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = req.body;

    await sequelize.transaction(async (t) => {
      const biodata = await biodataModel.create(
        {
          id: decoded.user.id,
          nama_lengkap: body.fullname,
          nama_panggilan: body.nickname,
          jenis_kelamin: body.gender,
          nim: body.nim,
          nia: `caang.${body.angkatan}.${body.nim.toString(16).toUpperCase()}`,
          sekolah_asal: body.school,
          alamat: body.address,
          nomor_hp: body.phone,
          fakultas: body.faculty,
          program_studi: body.departement,
          motivasi_bergabung: body.motivation,
          alasan_memilih: body.alasan_memilih,
          alasan_dipilih: body.rencana_kedepannya,
          software: body.software,
        },
        { transaction: t }
      );
    });

    res.status(200).json({ msg: "ok" });
  } catch {
    res.status(500).json({ msg: "internal server error" });
  }
};
