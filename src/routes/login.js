const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { User, Session } = require("../models/models");
const { addDays } = require("date-fns");
const { tokenDecoder } = require("../middleware/token");

const loginRouter = express.Router();

loginRouter.post("/login", async (req, res, next) => {
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
      jti: crypto.randomUUID(),
    };

    const token = jwt.sign(tokenData, process.env.SECRET);
    const { password: _password, ...responseUserData } = user.toJSON();

    await Session.create({
      user_id: user.id,
      expires_at: addDays(new Date(), 7),
      session_token: token,
    });

    return res.status(200).json({ ...responseUserData, token });
  } catch (err) {
    next(err);
  }
});

loginRouter.delete("/logout", tokenDecoder, async (req, res) => {
  await req.session.update({ is_active: false });
  return res.status(204).end();
});

module.exports = { loginRouter };
