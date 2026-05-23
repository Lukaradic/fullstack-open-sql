require("dotenv").config();
const app = require("./src/app");
require("./src/models/models");
const { connectToDB } = require("./src/config/dbConnection");

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await connectToDB();
    app.listen(PORT, () => {
      console.log("Server running on port: " + PORT);
    });
  } catch (err) {
    console.log("Unable to connect to the database with error:" + err);
    process.exit(1);
  }
}

start();
