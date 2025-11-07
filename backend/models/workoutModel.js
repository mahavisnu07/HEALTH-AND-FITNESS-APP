module.exports = (sequelize, DataTypes) => {
  const Workout = sequelize.define("Workout", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    exercise: { type: DataTypes.STRING },
    duration: { type: DataTypes.INTEGER }, // in minutes
    caloriesBurned: { type: DataTypes.FLOAT }
  });
  return Workout;
};
