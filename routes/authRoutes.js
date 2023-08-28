const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  deleteUser,
  editUser,
  getUser,
  updateToken,
  logout,
} = require("../controllers/authController");

const checkRequestBody = require("../middleware/checkRequestBody");
const authMiddleware = require("../middleware/authMiddleware");

// router.get("/", (req, res) => {
//   res.status(404).json({ message: "Not Found" });
// });

router.route("/register").post(checkRequestBody, registerUser);

router.route("/login").post(checkRequestBody, loginUser);

router.route("/logout").post(authMiddleware, logout);

router
  .route("/user/")
  .get(authMiddleware, getUser)
  .delete(authMiddleware, deleteUser)
  .put(authMiddleware, checkRequestBody, editUser);

router.route("/refresh").post(authMiddleware, updateToken);

module.exports = router;
