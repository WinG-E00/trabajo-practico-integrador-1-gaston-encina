import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Profile = sequelize.define('Profiel', {
  id: {},
  user_id: {},
  first_name: {},
  las_name: {},
  biography: {},
  avatar_url: {},
  brith_date: {}
}, {
  timestamps: true,
});
