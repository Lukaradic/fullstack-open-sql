const { Sequelize } = require("sequelize");
const { Umzug, SequelizeStorage } = require("umzug");
const path = require("path");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
});

const migrationConfig = {
  migrations: {
    glob: path.join(process.cwd(), "src/migrations/*.js"),
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
};

const runMigrations = async () => {
  const migrator = new Umzug(migrationConfig);
  const migrations = await migrator.up();
  console.log("Migrations up to date", {
    files: migrations.map((mig) => mig.name),
  });
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConfig);
  await migrator.down();
};

const connectToDB = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log("Connected to the Database");
  } catch (err) {
    console.log(err);
    console.log("failed to connect to the database");
    return process.exit(1);
  }
};

module.exports = { connectToDB, sequelize, rollbackMigration };
