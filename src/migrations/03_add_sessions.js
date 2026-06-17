const { DataTypes } = require("sequelize");

async function up({ context: queryInterface }) {
  await queryInterface.createTable("sessions", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    session_token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: { type: DataTypes.DATE, allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.removeColumn("users", "disabled");
  await queryInterface.dropTable("sessions");
}

module.exports = { up, down };
