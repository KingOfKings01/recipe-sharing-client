import RatingReview from '../models/RatingReview.js';
import User from '../models/User.js';
import { Op } from 'sequelize';


// Create a new rating and review
export async function createRatingReview(req, res) {
  try {
    const { rating, review, recipeId } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and `req.user` contains user info

    const newRatingReview = await RatingReview.create({
      rating,
      review,
      recipeId,
      userId,
    });

    res.status(201).json(newRatingReview);
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