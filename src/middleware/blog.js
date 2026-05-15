const { Blog } = require("../models/models");

const findBlogMiddleware = async (req, res, next) => {
  try {
    const { id } = req.params;
    req.blog = await Blog.findByPk(id);
    if (!req.blog) {
      throw new Error(`Couldn't find a blog with id of ${id}`);
    }
  } catch (err) {
    return res.status(404).json({ error: err.message });
  } finally {
    next();
  }
};

module.exports = { findBlogMiddleware };
