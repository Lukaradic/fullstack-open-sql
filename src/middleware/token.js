const jwt = require("jsonwebtoken");
const Session = require("../models/Session");
const { Op } = require("sequelize");

const tokenDecoder = async (req, res, next) => {
  try {
    const authHeader = req.get("authorization");
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      return res.status(401).json({ error: "No auth token provided" });
    }

    const token = req.get("authorization").substring(7);

    let userFromToken;
    try {
      userFromToken = jwt.verify(token, process.env.SECRET);
    } catch {
      return res.status(401).json({ error: "Invalid auth token" });
    }

    const session = await Session.findOne({
      where: {
        session_token: token,
        is_active: true,
        expires_at: { [Op.gt]: new Date() },
      },
    });

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    req.decodedToken = userFromToken;
    req.session = session;
    req.authToken = token;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { tokenDecoder };
