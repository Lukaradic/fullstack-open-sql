const Blog = require("./Blog");
const User = require("./User");
const ReadingList = require("./ReadingList");
const Session = require("./Session");

User.hasMany(Blog, { as: "blogs", foreignKey: "user_id" });
Blog.belongsTo(User, { as: "user", foreignKey: "user_id" });
Session.belongsTo(User, { foreignKey: "user_id" });

User.belongsToMany(Blog, {
  through: ReadingList,
  as: "readings",
  foreignKey: "user_id",
  otherKey: "blog_id",
});

module.exports = { Blog, User, Session };
