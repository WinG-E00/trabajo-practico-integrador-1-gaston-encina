import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Article = sequelize.define('Article', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [3, 200],
      notNull: { msg: 'El titulo es obligatorio' }
    }
    },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [50, Infinity],
        msg: 'El contenido debe tener como minimo 50 caracteres'
      },
      notEmpy: {
        msg: 'El contenido no puede estar vacio'
      }
    }
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


export default Article;
