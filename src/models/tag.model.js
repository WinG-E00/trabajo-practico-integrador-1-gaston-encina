import { DataTypes } from "sequelize";
import sequelize from "../config/database";


const Tag = sequelize.define('Tag', {

  id: {}, 
  name: {}

}, {
  timestamps: true,
})