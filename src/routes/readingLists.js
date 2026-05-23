const express = require("express");
const ReadingList = require("../models/ReadingList");

const { tokenDecoder } = require("../middleware/token");
const { findBlogMiddleware } = require("../middleware/blog");
const readingListsRouter = express.Router();

readingListsRouter.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;
    if (!userId || !blogId) {
      throw new Error("missing information about the user and blog");
    }
    const response = await ReadingList.create({
      user_id: userId,
      blog_id: blogId,
    });

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

readingListsRouter.put(
  "/:id",
  findBlogMiddleware,
  tokenDecoder,
  async (req, res, next) => {
    try {
      const userId = req.decodedToken.id;
      const blogId = req.blog.id;
      const { read } = req.body;

      if (read === undefined) {
        throw new Error("No read value provided");
      }
      const readingList = await ReadingList.update(
        { read },
        { where: { user_id: userId, blog_id: blogId } },
      );

      res.status(200).json(readingList);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = { readingListsRouter };
