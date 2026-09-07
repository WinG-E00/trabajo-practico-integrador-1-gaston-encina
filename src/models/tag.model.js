import { DataTypes } from "sequelize";
import sequelize from "../config/database";


const Tag = sequelize.define('Tag', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(30),
    validate: {
      len: [2, 30],
      notNull: { msg: 'El nombre no puede estar vacio' }
    }
  }

}, {
  timestamps: true,
})
