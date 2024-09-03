import axios from "axios";

// Base API URL for rating and reviews
const API_URL = `${import.meta.env.VITE_API}/rating-review`;

// Function to create a new rating and review
export async function createRatingReview(data) {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Something went wrong while creating the rating and review. Please try again later."
    );
  }
}

// Function to get all reviews for a specific recipe
export async function getReviewsByRecipe(recipeId) {
  try {
    const response = await axios.get(`${API_URL}/recipe/${recipeId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the token
      },
    });
    return response.data;
  } catch (err) {
    throw new Error(
      err?.response?.data?.message ||
        "Something went wrong while fetching the reviews. Please try again later."
    );
  }
}
