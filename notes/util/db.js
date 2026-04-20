const { DATABASE_URL } = require("./config");
const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(DATABASE_URL, {});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connected to the database");
  } catch (err) {
    console.log("Failed to connect to the database");
    return process.exit(1);
  } finally {
    return null;
  }
}

module.exports = { connectToDatabase, sequelize };
