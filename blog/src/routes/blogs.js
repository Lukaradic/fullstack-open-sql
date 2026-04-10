import express from "express";
import { Blog } from "../models/models.js";
export const blogRouter = express.Router();

blogRouter.get("/", async (_, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json(blogs);
  } catch (err) {
    (res.status(400), json({ error: err }));
  }
});
