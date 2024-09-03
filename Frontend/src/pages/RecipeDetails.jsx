import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../API/recipeApis'; // Your API function
import { followUser, unfollowUser } from '../API/followApi'; // Import follow/unfollow functions
import FeedbackAndRatingForm from '../components/FeedbackAndRatingForm'; // Import the new component
import { getReviewsByRecipe } from '../API/ratingReviewApis'; // Import the API function for reviews

function RecipeDetails() {
    const { id } = useParams(); // Get the recipe ID from URL params
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // State for follow status
    const [loadingFollow, setLoadingFollow] = useState(false); // State for follow/unfollow action
    const [reviews, setReviews] = useState([]); // State for storing reviews
    const [loadingReviews, setLoadingReviews] = useState(true); // State for loading reviews
    const [reviewError, setReviewError] = useState(null); // State for review errors
    const [showFeedbackForm, setShowFeedbackForm] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(id); // Fetch recipe by ID
                setRecipe(data);
                setIsFollowing(data.isFollowing); // Set the initial follow status
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { reviews, hasUserFeedback } = await getReviewsByRecipe(id); // Fetch reviews by recipe ID
                setReviews(reviews);
                console.log(reviews);
                setShowFeedbackForm(!hasUserFeedback);
                setLoadingReviews(false);
            } catch (err) {
                setReviewError(err.message);
                setLoadingReviews(false);
            }
        };

        fetchReviews();
    }, [id]);

    const handleFollowToggle = async () => {
        if (loadingFollow) return; // Prevent multiple clicks
        setLoadingFollow(true);

        try {
            if (isFollowing) {
                await unfollowUser(recipe.User.id); // Unfollow user
                setIsFollowing(false);
            } else {
                await followUser(recipe.User.id); // Follow user
                setIsFollowing(true);
            }
        } catch (err) {
            console.error(err.message);
        } finally {
            setLoadingFollow(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!recipe) return <p>No recipe found</p>;

    return (
        <div>
            <h1>{recipe.title}</h1>
            <img src={recipe.imageUrl} alt={recipe.title} style={{ width: "100%" }} />
            <h3>Total: {recipe.numberOfFeedbacks || "No feedbacks yet!"}</h3>
            <h3>Ratings: {recipe.averageRating || "No ratings yet!"}</h3>
            <h2>Ingredients</h2>
            <pre>{recipe.ingredients}</pre>
            <h2>Instructions</h2>
            <pre>{recipe.instructions}</pre>
            <h3>Dietary Preference: {recipe.dietaryPreference}</h3>
            <h3>Cooking Time: {recipe.cookingTime}</h3>
            <h3>Servings: {recipe.servings}</h3>
            <h3>Category: {recipe.categories}</h3>
            <h3>Preparation Time: {recipe.preparationTime}</h3>
            <h3>Difficulty Level: {recipe.difficultyLevel}</h3>
            <h3>
                Posted by: {recipe.User?.name}
                {" "}
                {isFollowing != null && <button onClick={handleFollowToggle} disabled={loadingFollow}>
                    {loadingFollow ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
                </button>}
            </h3>

            {/* Feedback and Rating Form */}
            {showFeedbackForm && <FeedbackAndRatingForm
                recipeId={id}
                initialFeedback="" // Optionally, pass initial feedback
                initialRating={0}   // Optionally, pass initial rating
            />}

            {/* Reviews Section */}
            <h2>Reviews</h2>
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : reviewError ? (
                <p>Error loading reviews: {reviewError}</p>
            ) : reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id}>
                        <p>By: {review.User.name}</p>
                        <h4>Rating: {review.rating}</h4>
                        <p>{review.review}</p>
                        <hr />
                    </div>
                ))
            ) : (
                <p>No reviews yet!</p>
            )}
        </div>
    );
}

export default RecipeDetails;
