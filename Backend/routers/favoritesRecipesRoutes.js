import express from 'express';
import {
  addRecipeToFavorites,
  getRecipesFromContainer,
  removeRecipeFromFavorites,
} from '../controllers/favoritesRecipesController.js';
import { authorization } from '../middlewares/auth.js';

const router = express.Router();

// Routes for managing favorite recipes
router.post('/add', authorization, addRecipeToFavorites); // Add a recipe to a container
router.get('/:containerId', authorization, getRecipesFromContainer); // Get all recipes from a container
router.delete('/:containerId/:recipeId', authorization, removeRecipeFromFavorites); // Remove a recipe from a container

export default router;
