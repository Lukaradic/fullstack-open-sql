import express from "express";
import { blogRouter } from "./routes/blogs.js";

const app = express();
app.use(express.json());
app.use("/api/blogs", blogRouter);

export default app;
