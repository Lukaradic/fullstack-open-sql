require("dotenv").config();
const app = require("./src/app");
const { sequelize } = require("./src/config/dbConnection");
require("./src/models/models");
const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
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
