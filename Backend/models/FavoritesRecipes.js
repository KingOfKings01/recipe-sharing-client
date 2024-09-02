import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

const FavoritesRecipes = sequelize.define('FavoritesRecipes', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: uuidv4,
  },
  containerId: {
    type: DataTypes.UUID,
    references: {
      model: 'FavoritesContainers', // Name of the FavoritesContainer table
      key: 'id', // Primary key in FavoritesContainer table
    },
    allowNull: false,
  },
  recipeId: {
    type: DataTypes.UUID,
    references: {
      model: 'Recipes', // Name of the Recipes table
      key: 'id', // Primary key in Recipes table
    },
    allowNull: false,
  },
});

export default FavoritesRecipes;
