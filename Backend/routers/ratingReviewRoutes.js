import express from 'express';
import {
  createRatingReview,
  getReviewsByRecipe,
  updateRatingReview,
  deleteRatingReview,
} from '../controllers/ratingReviewController.js';
import { authorization } from '../middlewares/auth.js';

const router = express.Router();

// Create a new rating and review
router.post('/', authorization, createRatingReview);

// Get all reviews for a recipe
router.get('/recipe/:recipeId', getReviewsByRecipe);

// Update a rating and review
router.put('/:id', authorization, updateRatingReview);

// Delete a rating and review
router.delete('/:id', authorization, deleteRatingReview);

export default router;
