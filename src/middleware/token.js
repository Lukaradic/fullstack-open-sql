const jwt = require("jsonwebtoken");

const tokenDecoder = async (req, res, next) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ error: "No auth token provided" });
    }
    const userFromToken = jwt.verify(
      req.get("authorization").substring(7),
      process.env.SECRET,
    );

    if (!userFromToken) {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    req.decodedToken = userFromToken;
    console.log(userFromToken);
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

module.exports = { tokenDecoder };
