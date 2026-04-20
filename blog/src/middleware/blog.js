import { Blog } from "../models/models.js";

export const findBlogMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.blog = await Blog.findByPk(id);
    if (!req.blog) {
      throw new Error(`Couldn't find a blog with id of ${id}`);
    }
  } catch (err) {
    console.log(err, "error from blog middleware");
    console.log(typeof err, "error from blog middleware");
    console.log(err?.message, "error message");
    return res.status(404).json({ error: err.message });
  } finally {
    next();
  }
};
