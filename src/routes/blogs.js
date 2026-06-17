const express = require("express");
const { Blog, User } = require("../models/models");
const { findBlogMiddleware } = require("../middleware/blog");
const { tokenDecoder } = require("../middleware/token");
const { Op } = require("sequelize");
const ReadingList = require("../models/ReadingList");

const blogRouter = express.Router();

blogRouter.get("/", async (req, res) => {
  try {
    const whereFilter = {};
    if (req.query.search) {
      whereFilter[Op.or] = [
        { title: { [Op.like]: `%${req.query.search}%` } },
        { author: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    const blogs = await Blog.findAll({
      order: [["likes", "DESC"]],
      include: {
        model: User,
        as: "user",
      },
      where: whereFilter,
    });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

blogRouter.post("/", tokenDecoder, async (req, res, next) => {
  try {
    const { author, title, url, year_written } = req?.body;
    if (!author || !title || !url) {
      throw new Error("Values author, title and url are required");
    }

    const newBlog = await Blog.create({
      author,
      title,
      url,
      user_id: req.decodedToken.id,
      year_written,
    });
    if (!newBlog) {
      throw new Error("Failed to create new blog");
    }
    res.status(200).json(newBlog);
  } catch (err) {
    next(err);
  }
});

blogRouter.delete(
  "/:id",
  [findBlogMiddleware, tokenDecoder],
  async (req, res, next) => {
    try {
      if (req.blog.UserId !== req.decodedToken.id) {
        return res.status(403).end();
      }
      await req.blog.destroy();
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },
);

blogRouter.put("/:id", findBlogMiddleware, async (req, res, next) => {
  try {
    const likes = req?.body?.likes;
    if (!likes) {
      throw new Error(`Likes not provided`);
    }
    req.blog.set({
      likes: likes,
    });
    const updatedBlog = await req.blog.save();
    res.status(200).json(updatedBlog);
  } catch (err) {
    next(err);
  }
});

blogRouter.post(
  "/:id/add-to-reading-list",
  findBlogMiddleware,
  tokenDecoder,
  async (req, res, next) => {
    try {
      const blogId = req.blog.id;
      const userId = req.decodedToken.id;
      const readingList = await ReadingList.create({
        user_id: userId,
        blog_id: blogId,
      });

      res.status(201).json(readingList);
    } catch (err) {
      next(err);
    }
  },
);

module.exports = { blogRouter };
