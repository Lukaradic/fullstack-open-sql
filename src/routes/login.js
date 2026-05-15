const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("../models/models");

const loginRouter = express.Router();

loginRouter.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("invalid username or password");
    }
    const user = await User.unscoped().findOne({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new Error("invalid username or password");
    }

    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if (!doesPasswordMatch) {
      throw new Error("invalid username or password");
    }
    const tokenData = {
      username: user.username,
      id: user.id,
    };

    const token = jwt.sign(tokenData, process.env.SECRET);
    const { password: _password, ...responseUserData } = user.toJSON();

    res.status(200).json({ token, data: responseUserData });
  } catch (err) {
    next(err);
  }
});

module.exports = { loginRouter };
