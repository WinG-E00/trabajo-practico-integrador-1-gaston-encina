import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const ArticleTag = sequelize.define('ArticleTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
}, {
  timestamps: true,
})


