import { ValidationError } from "sequelize";

export const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  console.log(error, "error from error handler");
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error });
  }

  return res.status(500).json({
    message: error?.message,
  });
};
