module.exports = (sequelize, DataTypes) => {
  const HealthMetrics = sequelize.define("HealthMetrics", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    bloodPressure: { type: DataTypes.STRING },
    heartRate: { type: DataTypes.INTEGER },
    sleepHours: { type: DataTypes.FLOAT }
  });
  return HealthMetrics;
};
