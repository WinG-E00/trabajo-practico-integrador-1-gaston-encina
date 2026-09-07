import { DataTypes } from "sequelize";
import sequelize from "../config/database";


const Article = sequelize.define('Article', {
    id: {},
    title: {},
    content: {}, 
    excerpt: {}, 
    status: {}
    //user_id //foreign key
    
  }, {
  timestamps: true,
  }
)