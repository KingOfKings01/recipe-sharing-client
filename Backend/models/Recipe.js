import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library

const Recipe = sequelize.define(
  'Recipe',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4, // Generate a UUID by default
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ingredients: {
      type: DataTypes.JSONB, // Store ingredients as a JSON array
      allowNull: false,
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    dietaryPreference: {
      type: DataTypes.STRING, // e.g., 'Vegetarian', 'Vegan', 'Gluten-Free', etc.
      allowNull: true,
    },
    cookingTime: {
      type: DataTypes.STRING, // e.g., '10-15 mins'
      allowNull: false,
    },
    servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categories: {
      type: DataTypes.JSONB, // Store categories as a JSON array
      allowNull: false,
    },
    preparationTime: {
      type: DataTypes.STRING, // e.g., '10-15 mins'
      allowNull: false,
    },
    difficultyLevel: {
      type: DataTypes.STRING, // e.g., 'Easy', 'Medium', 'Hard'
      allowNull: false,
    },
    averageRating: {
      type: DataTypes.FLOAT, // e.g., 4.5
      allowNull: false,
      validate: {
        min: 0,
        max: 5,
      },
    },
    numberOfFeedbacks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: 'Users', // The name of the Users table
        key: 'id', // The primary key of the Users table
      },
      allowNull: false,
    },
  }
);

export default Recipe;
