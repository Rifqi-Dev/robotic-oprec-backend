const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sequelize = require("../config/database");
const progressModel = require("../models/progresModel");

User.sync({ force: false })
  .then(() => {
    console.log("User table synced");
  })
  .catch((err) => {
    console.error("Error syncing User table:", err);
  });

progressModel.progress
  .sync({ force: false })
  .then(() => console.log("progress table synced"))
  .catch((err) => {
    console.error("error syncing progress table:", err);
  });

const registerUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    //search username first and return if user already exists
    let user = await User.findOne({ where: { username } });

    if (user) {
      return res.status(201).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    user = await User.create({
      username,
      password: hashPassword,
      email,
      role: "caang",
    });
    await user.save();

    progressCaang = await progressModel.progress.create({
      id: user.id,
    });
    await progressCaang.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, { expire: 360000 + Date.now() });
        res.status(201).json({ message: "User created", token: token });
      }
    );
  } catch (err) {
    res.status(500).send("Internal server error");
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ where: { username: username } });
    console.log(user);
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token, { expire: 360000 + Date.now() });
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findByPk(decoded.user.id);
    await user.destroy();
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(201).json({ message: `user ${user.username} deleted` });
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

const editUser = async (req, res) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = await User.findByPk(decoded.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const { username, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    user.username = username;
    user.password = hashPassword;
    user.email = email;
    user.save();
    res.status(201).json({ message: `user ${user.username} edited` });
  } catch (err) {
    res.status(500).send("internal server error");
  }
};

const getUser = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findByPk(decoded.user.id);
  if (!user) {
    res.status(404).json({ msg: "user not found" });
  }
  res.status(200).json({ id: user.id, role: user.role });
};

const updateToken = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const payload = {
    user: {
      id: decoded.user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { expire: 360000 + Date.now() });
      res.json({ token });
    }
  );
};

const logout = async (req, res) => {
  const token = req.header("Authorization");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const payload = {
    user: {
      id: decoded.user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: "0" },
    (err, token) => {
      if (err) throw err;
      res.cookie("token", token, { expire: 0 });
      res.json({ token });
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  deleteUser,
  editUser,
  getUser,
  updateToken,
  logout,
};
