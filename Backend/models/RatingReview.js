import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Recipe from './Recipe.js';

const RatingReview = sequelize.define('RatingReview', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    },
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
});


export default RatingReview;
