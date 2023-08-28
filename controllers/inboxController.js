const jwt = require("jsonwebtoken");
const sequelize = require("../config/database");
const { inbox } = require("../models/inboxModel");
const User = require("../models/userModel");
const { query } = require("express");

inbox
  .sync({ force: false })
  .then(() => console.log("inbox table synced"))
  .catch((err) => {
    console.error("error syncing inbox table:", err);
  });

module.exports.createInbox = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let body = req.body;

  var user = await User.findByPk(decoded.user.id);
  if (user.role === "caang") {
    res.status(401).json({ message: "unauthorize" });
    return;
  }
  await sequelize.transaction(async (t) => {
    await inbox.create(
      {
        title: body.title,
        writter: body.author,
        content: body.content,
      },
      { transaction: t }
    );
  });

  res.status(201).json({ message: `new inbox created` });
};

module.exports.getInbox = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let user = await User.findByPk(decoded.user.id);
  if (!user) return res.status(401).json({ message: "unauthorize" });

  let page = parseInt(req.query.page);
  let itemPerPage = parseInt(req.query.itemPerPage);

  let offset = (page - 1) * itemPerPage;

  const { count, rows } = await inbox.findAndCountAll({
    order: [["updatedAt", "DESC"]],
    limit: itemPerPage,
    offset: offset,
  });

  const totalPage = Math.ceil(count / itemPerPage);
  const remainPage = totalPage - page;
  if (remainPage < 0) {
    return res.status(400).json({ message: "invalid page" });
  }

  const formattedData = rows.map((message) => ({
    id: message.id,
    createdAt: message.updatedAt,
    title: message.title,
    author: message.writter,
    content: message.content,
  }));

  const payload = {
    page: page,
    remainPage: remainPage,
    totalPage: totalPage,
    message: formattedData,
    total: count,
  };

  res.status(200).json(payload);
};

module.exports.editInbox = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let body = req.body;

  let user = await User.findByPk(decoded.user.id);
  if (user.role === "caang") {
    res.status(401).json({ message: "unauthorize" });
    return;
  }

  let inboxMessage = await inbox.findByPk(body.id);
  if (!inboxMessage) {
    return res.status(404).json({ message: `inbox ${body.id} not exist` });
  }

  if (!body.content || !body.title)
    return res.status(400).json({ message: `invalid parameter` });

  inboxMessage.title = body.title;
  inboxMessage.content = body.content;
  inboxMessage.save();

  res.json({ message: `inbox message id ${body.id} edited` });
};

module.exports.deteleInbox = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  let id = req.body.id;

  var user = await User.findByPk(decoded.user.id);
  if (user.role === "caang") {
    res.status(401).json({ message: "unauthorize" });
    return;
  }

  await inbox.destroy({ where: { id: id } });
  res.json({ message: `inbox message ${id} deleted` });
};
