import express from "express";
import { blogRouter } from "./routes/blogs.js";
import { errorHandler } from "./middleware/error.js";

const app = express();
app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use(errorHandler);

export default app;
