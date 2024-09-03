import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipeById } from '../API/recipeApis';
import { followUser, unfollowUser } from '../API/followApi';
import FeedbackAndRatingForm from '../components/FeedbackAndRatingForm';
import { getReviewsByRecipe } from '../API/ratingReviewApis';
import PopupBox from '../components/PopupBox'; // Import the PopupBox component

function RecipeDetails() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [reviewError, setReviewError] = useState(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await getRecipeById(id);
                setRecipe(data);
                setIsFollowing(data.isFollowing);
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
                const { reviews, hasUserFeedback } = await getReviewsByRecipe(id);
                setReviews(reviews);
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
        if (loadingFollow) return;
        setLoadingFollow(true);

        try {
            if (isFollowing) {
                await unfollowUser(recipe.User.id);
                setIsFollowing(false);
            } else {
                await followUser(recipe.User.id);
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
            
            {/* Button to show popup */}
            <button onClick={() => setShowPopup(true)}>Manage Favorites</button>

            {/* Render the PopupBox component */}
            {showPopup && <PopupBox recipeId={id} onClose={() => setShowPopup(false)} />}

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
                initialFeedback=""
                initialRating={0}
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
