import express from 'express';
import {
  createRatingReview,
  getReviewsByRecipe,
} from '../controllers/ratingReviewController.js';
import { authorization } from '../middlewares/auth.js';

const router = express.Router();

// Create a new rating and review
router.post('/', authorization, createRatingReview);

// Get all reviews for a recipe
router.get('/recipe/:recipeId', authorization, getReviewsByRecipe);

export default router;
