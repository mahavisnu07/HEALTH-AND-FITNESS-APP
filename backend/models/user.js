const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize");

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  height: {
    type: DataTypes.FLOAT, // in meters
    allowNull: false,
  },
  weight: {
    type: DataTypes.FLOAT, // in kg
    allowNull: false,
  },
  bmi: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

module.exports = User;
