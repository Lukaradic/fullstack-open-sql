const express = require("express");
const { User, Blog } = require("../models/models");

const usersRouter = express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser) {
      throw new Error("Failed to create a user");
    }
    const responseUserData = newUser.toJSON();
    delete responseUserData.password;
    return res.status(201).json(responseUserData);
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

    return res.status(200).json(users);
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
    return res.status(200).json(user);
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
          as: "readings",
          attributes: {
            exclude: ["createdAt", "updatedAt", "user_id", "UserId"],
          },
          through: {
            attributes: ["id", "read"],
            where: read !== undefined ? { read: read === "true" } : undefined,
          },
        },
      ],
    });

    const userData = user.toJSON();
    userData.readings = userData.readings.map(({ ReadingList, ...blog }) => ({
      ...blog,
      reading_list: ReadingList,
    }));

    return res.status(200).json(userData);
  } catch (err) {
    next(err);
  }
});

module.exports = { usersRouter };
