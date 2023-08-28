var express = require("express");
var cors = require("cors");
const dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
const path = require("path");
var bodyParser = require("body-parser");
const errorMiddleware = require("./middleware/errorMiddleware");

dotenv.config({ path: "./.env" });
var app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/oprec", require("./routes/oprecRoutes"));
app.use("/api/inbox", require("./routes/inboxRoutes"));

app.use(errorMiddleware);
app.listen(3001);
console.log("App started on port 3001");
