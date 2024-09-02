import RatingReview from '../models/RatingReview.js';

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

// Get all reviews for a recipe
export async function getReviewsByRecipe(req, res) {
  try {
    const { recipeId } = req.params;

    const reviews = await RatingReview.findAll({ where: { recipeId } });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve reviews', error: error.message });
  }
}

// Update a rating and review
export async function updateRatingReview(req, res) {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    const updatedReview = await RatingReview.update(
      { rating, review },
      { where: { id, userId: req.user.id } } // Ensure that users can only update their own reviews
    );

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update rating and review', error: error.message });
  }
}

// Delete a rating and review
export async function deleteRatingReview(req, res) {
  try {
    const { id } = req.params;

    await RatingReview.destroy({ where: { id, userId: req.user.id } }); // Ensure that users can only delete their own reviews

    res.status(200).json({ message: 'Rating and review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete rating and review', error: error.message });
  }
}
