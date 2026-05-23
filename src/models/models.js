const Blog = require("./Blog");
const User = require("./User");
const ReadingList = require("./ReadingList");

User.hasMany(Blog, { as: "blogs" });
Blog.belongsTo(User);

ReadingList.belongsTo(User, { foreignKey: "user_id" });
ReadingList.belongsTo(Blog, { foreignKey: "blog_id" });

User.hasMany(ReadingList, { foreignKey: "user_id", as: "readinglists" });
Blog.hasMany(ReadingList, { foreignKey: "blog_id", as: "readinglists" });

module.exports = { Blog, User };
