const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const checkRequestBody = require("../middleware/checkRequestBody");
const {
  createInbox,
  getInbox,
  deteleInbox,
  editInbox,
} = require("../controllers/inboxController");
const router = express.Router();

router
  .route("/")
  .post(authMiddleware, checkRequestBody, createInbox)
  .get(authMiddleware, getInbox)
  .delete(authMiddleware, checkRequestBody, deteleInbox)
  .put(authMiddleware, checkRequestBody, editInbox);

module.exports = router;
