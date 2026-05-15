const express = require("express");
const { User, Blog } = require("../models/models");

const resetRouter = express.Router();

resetRouter.post("/", async (_, res, next) => {
  try {
    await User.truncate({ cascade: true });
    await Blog.truncate({ cascade: true });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = { resetRouter };
