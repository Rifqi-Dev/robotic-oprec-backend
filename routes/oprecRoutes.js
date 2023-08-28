const express = require("express");
const router = express.Router();
const OprecController = require("../controllers/oprecController");

const checkRequestBody = require("../middleware/checkRequestBody");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.route("/progress").get(authMiddleware, OprecController.getProgress);
router
  .route("/biodata")
  .get(authMiddleware, OprecController.getBio)
  .post(authMiddleware, checkRequestBody, OprecController.setBio);

router
  .route("/attachment")
  .post(
    authMiddleware,
    upload.fields([
      { name: "photo", maxCount: 1 },
      { name: "ktm", maxCount: 1 },
      { name: "krs", maxCount: 1 },
    ]),
    OprecController.attachment
  )
  .get();

module.exports = router;
