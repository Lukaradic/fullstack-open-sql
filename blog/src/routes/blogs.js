import express from "express";
import { Blog } from "../models/models.js";
import { findBlogMiddleware } from "../middleware/blog.js";

export const blogRouter = express.Router();

blogRouter.get("/", async (_, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (err) {
    (res.status(400), json({ error: err }));
  }
});

blogRouter.post("/", async (req, res, next) => {
  try {
    const { author, title, url } = req?.body;
    if (!author || !title || !url) {
      throw new Error("Values author, title and url are required");
    }
    const newBlog = await Blog.create({ author, title, url });
    if (!newBlog) {
      throw new Error("Failed to create new blog");
    }
    res.status(200).json({ blog: newBlog, success: true });
  } catch (err) {
    next(err);
  }
});

blogRouter.delete("/:id", findBlogMiddleware, async (req, res, next) => {
  try {
    await req.blog.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

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
    res.status(200).json({ blog: updatedBlog });
  } catch (err) {
    next(err);
  }
});
