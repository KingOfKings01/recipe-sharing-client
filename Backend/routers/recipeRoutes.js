import express from 'express';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  browseAndSearchRecipes,
} from '../controllers/recipeController.js';
import { authorization } from '../middlewares/auth.js';

const router = express.Router();

// Create a new recipe
router.post('',authorization, createRecipe);

// Get all recipes
router.get('',authorization, getAllRecipes);

// Get a single recipe by ID
router.get('/:id',authorization, getRecipeById);

// Search for recipes by name or ingredient, etc.
router.get('/search',authorization, browseAndSearchRecipes);

// Update a recipe
router.put('/:id',authorization, updateRecipe);

// Delete a recipe
router.delete('/:id',authorization, deleteRecipe);

export default router;
