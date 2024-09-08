import RatingReview from '../models/RatingReview.js';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { Op } from 'sequelize';



//Todo: Create a new rating and review and update average rating and number of feedbacks.
export async function createRatingReview(req, res) {
  try {
    const { rating, review, recipeId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and `req.user` contains user info

    // Create the new rating and review
    const newRatingReview = await RatingReview.create({
      rating,
      review,
      recipeId,
      userId,
    });

    // Fetch the current recipe details
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Calculate the new average rating and increment the number of feedbacks
    const newNumberOfFeedbacks = recipe.numberOfFeedbacks + 1;
    const newAverageRating = 
      (recipe.averageRating * recipe.numberOfFeedbacks + rating) / newNumberOfFeedbacks;

    // Update the recipe with the new average rating and number of feedbacks
    recipe.averageRating = newAverageRating;
    recipe.numberOfFeedbacks = newNumberOfFeedbacks;

    await recipe.save(); // Save the updated recipe

    // Respond with the created rating/review and updated recipe
    res.status(201).json({
      ratingReview: newRatingReview,
      updatedRecipe: recipe
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to create rating and review', error: error.message });
  }
}



// Get all reviews for a recipe and prioritize the current user's feedback if it exists
export async function getReviewsByRecipe(req, res) {
  try {
    const userId = req.user.id; // Get the current user's ID
    const { recipeId } = req.params; // Get the recipe ID from the request parameters

    // Retrieve the current user's feedback for the recipe
    const userReview = await RatingReview.findOne({
      where: { recipeId, userId },
      include: [{ model: User, attributes: ['name'] }] // Include the User model and fetch the username
    });

    let hasUserFeedback = userReview ? true : false;

    // Retrieve feedbacks for the recipe excluding the current user's feedback
    const otherReviews = await RatingReview.findAll({
      where: { recipeId, userId: { [Op.ne]: userId } }, // Exclude current user's review
      limit: 7, // Limit to a maximum of 7 reviews
      order: [['createdAt', 'DESC']], // Optionally, order reviews by creation date
      include: [{ model: User, attributes: ['name'] }] // Include the User model and fetch the username
    });

    // Combine userReview (if it exists) with the other reviews
    const reviews = userReview ? [userReview, ...otherReviews] : otherReviews;

    res.status(200).json({ reviews, hasUserFeedback });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
  }
}