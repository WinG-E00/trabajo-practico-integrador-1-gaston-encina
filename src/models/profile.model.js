import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Profile = sequelize.define('Profiel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true, 
    autoIncrement: true,
  },
  //user_id: {}, esto tiene que ser una foreign Key
  first_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  las_name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  birth_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default Profile ;