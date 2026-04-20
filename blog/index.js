import app from "./src/app.js";
import { sequelize } from "./src/config/dbConnection.js";
import { Blog } from "./src/models/models.js";

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    Blog.sync();
    console.log("Connected to the Database");

    app.listen(PORT, () => {
      console.log("Server running on port: " + PORT);
    });
  } catch (err) {
    console.log("Unable to connect to the database with error:" + err);
    process.exit(1);
  }
}

start();
