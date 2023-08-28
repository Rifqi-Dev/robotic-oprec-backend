const multer = require("multer");
const jwt = require("jsonwebtoken");

module.exports = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle Multer errors
    res.status(400).json({ error: "File upload error", message: err.message });
  } else if (err instanceof jwt.TokenExpiredError) {
    res
      .status(401)
      .json({ error: "Authorization error", message: err.message });
  } else {
    // Handle other errors
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
  }
};
