const { DataTypes } = require("sequelize");

async function up({ context: queryInterface }) {
  await queryInterface.addColumn("blogs", "year_written", {
    type: DataTypes.INTEGER,
    defaultValue: null,
  });
}
async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("blogs", "year_written");
}

module.exports = { up, down };
