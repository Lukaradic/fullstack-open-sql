const Blog = require("./Blog");
const User = require("./User");

User.hasMany(Blog, { as: "blogs" });
Blog.belongsTo(User);

module.exports = { Blog, User };
