const express = require("express");
const { fn, col } = require("sequelize");
const { Blog } = require("../models/models");

const authorsRouter = express.Router();

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await Blog.findAll({
      attributes: [
        "author",
        [fn("COUNT", col("id")), "blogs"],
        [fn("SUM", col("likes")), "likes"],
      ],
      group: "author",
      order: [["likes", "DESC"]],
    });

    res.status(200).json(authors);
  } catch (err) {
    next(err);
  }
});

module.exports = { authorsRouter };
