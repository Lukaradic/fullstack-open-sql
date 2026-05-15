const { ValidationError } = require("sequelize");

const errorHandler = (error, req, res, next) => {
  if (error instanceof ValidationError) {
    res.status(400).json({ error: error });
  }

  return res.status(500).json({
    message: error?.message,
  });
};

module.exports = { errorHandler };
