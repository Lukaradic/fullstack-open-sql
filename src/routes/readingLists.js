const express = require("express");
const ReadingList = require("../models/ReadingList");

const {
  ForeignKeyConstraintError,
  UniqueConstraintError,
} = require("sequelize");
const { tokenDecoder } = require("../middleware/token");
const { findBlogMiddleware } = require("../middleware/blog");
const readingListsRouter = express.Router();

readingListsRouter.post("/", async (req, res, next) => {
  try {
    const { userId, blogId } = req.body;
    if (!userId || !blogId) {
      return res
        .status(400)
        .json({ error: "Missing information about the user and/or blog" });
    }
    const [entry, created] = await ReadingList.findOrCreate({
      where: {
        user_id: userId,
        blog_id: blogId,
      },
    });

    if (!created) {
      return res.status(400).json({ error: "Blog already in reading list" });
    }
    return res.status(201).json(entry);
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      return res.status(404).json({ error: "User or blog not found" });
    }

    if (err instanceof UniqueConstraintError) {
      return res.status(404).json({ error: "Blog already in reading list" });
    }

    next(err);
  }
});

readingListsRouter.put("/:id", tokenDecoder, async (req, res, next) => {
  try {
    const userId = req.decodedToken.id;
    const { id } = req.params;
    const { read } = req.body;

    if (!id) {
      return res.status(401).json({ message: "No id provided" });
    }

    if (read === undefined) {
      throw new Error("No read value provided");
    }

    const readingList = await ReadingList.findByPk(id);
    if (!readingList) {
      return res.status(404).json({ message: "Uknown reading list id" });
    }
    const [rowsAffected] = await ReadingList.update(
      {
        read,
      },
      {
        where: {
          id: id,
          user_id: userId,
        },
      },
    );

    if (rowsAffected === 0) {
      return res.status(401).end();
    }

    return res.status(200).json({ read: read });
  } catch (err) {
    console.log(err, "err from request");
    next(err);
  }
});

module.exports = { readingListsRouter };
