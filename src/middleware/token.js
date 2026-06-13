const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

const tokenDecoder = async (req, res, next) => {
  try {
    const authHeader = req.get("authorization");
    const sessionId = req.get("sessionId");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ error: "No auth token provided" });
    }

    const session = await Session.findOne({
      where: { id: sessionId, is_active: true },
    });

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }
    const userFromToken = jwt.verify(
      req.get("authorization").substring(7),
      process.env.SECRET,
    );

    if (!userFromToken) {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    req.decodedToken = userFromToken;
    req.session = session;
  } catch (err) {
    next(err);
  } finally {
    next();
  }
};

module.exports = { tokenDecoder };
