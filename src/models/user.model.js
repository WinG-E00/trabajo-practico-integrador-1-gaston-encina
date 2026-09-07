import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const User = sequelize.define('User', {
  id: {},
  username: {},
  email: {},
  password: {},
  role: {},
}, {
  timestamps: true, 
  paranoid: true,
})