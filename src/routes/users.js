const express = require("express");
const { User, Blog } = require("../models/models");
const ReadingList = require("../models/ReadingList");

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser) {
      throw new Error("Failed to create a user");
    }
    const responseUserData = newUser.toJSON();
    delete responseUserData.password;
    res.status(201).json(responseUserData);
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/", async (_, res, next) => {
  try {
    const users = await User.findAll({
      include: {
        model: Blog,
        as: "blogs",
      },
    });

    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

usersRouter.put("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const { username: newUsername } = req.body;
    if (!username) {
      throw new Error("No username provided");
    }

    if (!newUsername) {
      throw new Error("No new username provided");
    }
    const user = await User.findOne({
      where: { username },
    });

    user.username = newUsername;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const userId = req.params.id;

    const { read } = req?.query;
    const where = {};
    if (read !== undefined) {
      where.read = read === "true";
    }
    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Blog,
          as: "blogs",
          attributes: {
            exclude: ["createdAt", "updatedAt", "user_id", "UserId"],
          },
          include: [
            {
              model: ReadingList,
              as: "readinglists",
              attributes: ["id", "read"],
              where: where,
            },
          ],
        },
      ],
    });

    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = { usersRouter };
