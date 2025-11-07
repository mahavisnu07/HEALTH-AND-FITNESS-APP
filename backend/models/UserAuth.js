import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const UserAuth = sequelize.define("UserAuth", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default UserAuth;
