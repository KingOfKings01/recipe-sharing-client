import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const FavoritesContainer = sequelize.define('FavoritesContainer', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: uuidv4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: 'Users', // Name of the Users table
      key: 'id', // Primary key in Users table
    },
    allowNull: false,
  },
});

export default FavoritesContainer;
