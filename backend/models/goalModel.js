module.exports = (sequelize, DataTypes) => {
  const Goal = sequelize.define("Goal", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    goalType: { type: DataTypes.STRING }, // weight loss, muscle gain, etc.
    targetWeight: { type: DataTypes.FLOAT },
    deadline: { type: DataTypes.DATE },
    progress: { type: DataTypes.FLOAT, defaultValue: 0 }
  });
  return Goal;
};
