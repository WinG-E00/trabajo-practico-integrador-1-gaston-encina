import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(20),
    unique: true,
    allowNull: false,
    validate: {
      len: [3, 20],
      notNull: { msg: 'El username es obligatorio' }
    }
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    //Debe contener el validador de express validator para comprobar que sea email.
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    //Tiene que estar hasheada con bcrypt
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defautlValue: 'user',
    allowNull: false,
  },
}, {
  timestamps: true,
  paranoid: true,
});
