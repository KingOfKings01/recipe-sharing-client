import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRecipeById } from '../API/recipeApis';
import { followUser, unfollowUser } from '../API/followApi';
import FeedbackAndRatingForm from '../components/FeedbackAndRatingForm';
import { getReviewsByRecipe } from '../API/ratingReviewApis';
import PopupBox from '../components/PopupBox'; // Import the PopupBox component
import { IoHeartOutline } from "react-icons/io5";
import '../detail_page.css'

function RecipeDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loadingFollow, setLoadingFollow] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    // eslint-disable-next-line no-unused-vars
    const [reviewError, setReviewError] = useState(null);
    const [showFeedbackForm, setShowFeedbackForm] = useState(true);
    const [showPopup, setShowPopup] = useState(false); // State to control popup visibility

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            alert("Please login first!")
            navigate('/login')
        }

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
        <div className='container'>
            <h1>{recipe.title}</h1>
            <div className='card'>
                <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className='food-image'
                    onError={(e) => {
                        e.target.onerror = null; // Prevents looping
                        e.target.src = "../../public/Food.svg";
                    }}
                />

                <div className='details'>
                    <p>Total: {recipe.numberOfFeedbacks || "No feedbacks yet!"}</p>
                    <p>Ratings: {recipe.averageRating || "No ratings yet!"}</p>
                    <p>Dietary Preference: {recipe.dietaryPreference}</p>
                    <p>Cooking Time: {recipe.cookingTime}</p>
                    <p>Servings: {recipe.servings}</p>
                    <p>Category: {recipe.categories}</p>
                    <p>Preparation Time: {recipe.preparationTime}</p>
                    <p>Difficulty Level: {recipe.difficultyLevel}</p>

                    <p>
                        Posted by: {recipe.User?.name}
                        {" "}
                        {isFollowing != null && <button className={isFollowing ? "Unfollow" : "Follow"} onClick={handleFollowToggle} disabled={loadingFollow}>
                            {loadingFollow ? "Processing..." : isFollowing ? "Unfollow" : "Follow"}
                        </button>}
                    </p>

                    {/* Button to show popup */}
                    <p className='fav-btn' onClick={() => setShowPopup(true)}><IoHeartOutline className="fav-icon" /></p>

                    {/* Render the PopupBox component */}
                    {showPopup && <PopupBox recipeId={id} onClose={() => setShowPopup(false)} />}
                </div>

            </div>



            <h2>Ingredients</h2>
            <pre>{recipe.ingredients}</pre>
            <h2>Instructions</h2>
            <pre>{recipe.instructions}</pre>


            {/* Feedback and Rating Form */}
            {showFeedbackForm &&
                <>
                    <hr />
                    <FeedbackAndRatingForm
                        recipeId={id}
                        initialFeedback=""
                        initialRating={0}
                        setShowFeedbackForm={setShowFeedbackForm}
                    />
                </>

            }

            <hr />

            {/* Reviews Section */}
            <h2>Reviews</h2>
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : reviews.length > 0 ? (
                reviews.map(review => (
                    <div key={review.id}>
                        <p><strong>Rating:</strong> {review.rating}</p>
                        <p><strong>Feedback:</strong> {review.review}</p>
                        <p><strong>By:</strong> {review.User.name}</p>
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
