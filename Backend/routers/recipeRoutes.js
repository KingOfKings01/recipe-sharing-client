import express from 'express';
import multer from 'multer';
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  getUserRecipes,
  updateRecipe,
  deleteRecipe,
  browseAndSearchRecipes,
  uploadImage,
} from '../controllers/recipeController.js';
import { authorization } from '../middlewares/auth.js';
// import { uploadImageMiddleware } from '../middlewares/uploadImage.js';

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Route to handle file upload (requires authorization)
router.post("/uploadImage", authorization, upload.single('file'), uploadImage);

// Create a new recipe with an image
router.post('', authorization, createRecipe);

// Get all recipes
router.get('', getAllRecipes);
// Get a single recipe by ID

router.get('/user',authorization, getUserRecipes);
// Search for recipes by name or ingredient, etc.
router.get('/search', browseAndSearchRecipes);

// Update a recipe
router.put('/:id',authorization, updateRecipe);

// Delete a recipe
router.delete('/:id',authorization, deleteRecipe);

router.get('/:id',authorization, getRecipeById);

export default router;
