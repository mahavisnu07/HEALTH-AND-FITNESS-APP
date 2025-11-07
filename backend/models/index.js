const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Use SQLite for local development (can switch to PostgreSQL/MySQL later)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../database.sqlite"),
  logging: false,
});

// Import models
const User = require("./userModel")(sequelize, DataTypes);
const Diet = require("./dietModel")(sequelize, DataTypes);
const Workout = require("./workoutModel")(sequelize, DataTypes);
const Goal = require("./goalModel")(sequelize, DataTypes);
const HealthMetrics = require("./healthMetricsModel")(sequelize, DataTypes);

// Define relationships
User.hasMany(Diet, { foreignKey: "userId", onDelete: "CASCADE" });
Diet.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Workout, { foreignKey: "userId", onDelete: "CASCADE" });
Workout.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Goal, { foreignKey: "userId", onDelete: "CASCADE" });
Goal.belongsTo(User, { foreignKey: "userId" });

User.hasMany(HealthMetrics, { foreignKey: "userId", onDelete: "CASCADE" });
HealthMetrics.belongsTo(User, { foreignKey: "userId" });

// Export all models
module.exports = {
  sequelize,
  User,
  Diet,
  Workout,
  Goal,
  HealthMetrics,
};
