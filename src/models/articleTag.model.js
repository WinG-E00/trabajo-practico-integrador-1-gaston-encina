import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ArticleTag = sequelize.define('ArticleTag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  }
}, {
  timestamps: true,
})


export default ArticleTag;