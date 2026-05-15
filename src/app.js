const express = require("express");
const { blogRouter } = require("./routes/blogs");
const { usersRouter } = require("./routes/users");
const { errorHandler } = require("./middleware/error");
require("./models/models");
const { loginRouter } = require("./routes/login");
const { authorsRouter } = require("./routes/authors");
const { resetRouter } = require("./routes/reset");

const app = express();
app.use(express.json());

app.get("/", (_, res) => res.status(200).end());
app.use("/api/blogs", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/reset", resetRouter);
app.use(errorHandler);

module.exports = app;
