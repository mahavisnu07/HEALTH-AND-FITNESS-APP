module.exports = (sequelize, DataTypes) => {
  const Diet = sequelize.define("Diet", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
    mealType: { type: DataTypes.STRING }, // breakfast, lunch, dinner
    foodItems: { type: DataTypes.TEXT },
    calories: { type: DataTypes.FLOAT }
  });
  return Diet;
};
