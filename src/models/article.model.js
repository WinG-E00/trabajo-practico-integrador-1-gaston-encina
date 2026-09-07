import { DataTypes } from "sequelize";
import sequelize from "../config/database";


const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
  title: {
    type: DataTypes.STRING(200),
    validate: {
      len: [3, 200],
      notNull: { msg: 'El titulo es obligatorio' }
    }
    },
  content: {
    type: DataTypes.TEXT(50),
    allowNull: false,
    }, 
  excerpt: {
    type: DataTypes.STRING(500),
    allowNull: true,
    }, 
  status: {
    type: DataTypes.ENUM('published', 'archived'),
    defaultValue: 'published',
    allowNull: false
    }
    //user_id //foreign key
    
  }, {
  timestamps: true,
  }
)