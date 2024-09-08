import PropTypes from 'prop-types';
import { useState } from 'react';
import { createRatingReview } from '../API/ratingReviewApis'; // Import the API function

function FeedbackAndRatingForm({ recipeId, initialFeedback, initialRating, setShowFeedbackForm }) {
  const [feedback, setFeedback] = useState(initialFeedback); // State for feedback input
  const [rating, setRating] = useState(initialRating); // State for rating input
  const [submitting, setSubmitting] = useState(false); // State for submission

  const handleSubmit = async () => {
    if (submitting) return; // Prevent multiple submissions
    setSubmitting(true);

    try {
      // Combined API call to submit both feedback and rating
      await createRatingReview({
        recipeId,
        review: feedback,
        rating,
      });

      // Clear feedback and rating after submission
      setFeedback("");
      setRating(0);
      setShowFeedbackForm(pre => !pre)
      alert("Feedback and Rating submitted successfully!");
    } catch (err) {
      alert(err?.message || "Failed to submit feedback and rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Star Rating */}
      <div>
        <h2>Rate This Recipe</h2>
        <div>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => setRating(star)}
              style={{
                cursor: "pointer",
                color: star <= rating ? "gold" : "gray",
                fontSize: "24px",
              }}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Feedback Form */}
      <div className='feedback-form'>
        <h2>Leave Feedback</h2>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          rows={4}
          style={{ width: "100%" }}
        />
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={submitting || (!feedback && rating === 0)} // Disable button if no feedback or rating
      >
        {submitting ? "Submitting..." : "Submit Feedback and Rating"}
      </button>
      </div>

    </div>
  );
}

// Define prop types
FeedbackAndRatingForm.propTypes = {
  recipeId: PropTypes.string.isRequired,   // recipeId is required and must be a number
  initialFeedback: PropTypes.string,       // initialFeedback is optional and must be a string
  initialRating: PropTypes.number,         // initialRating is optional and must be a number
  setShowFeedbackForm: PropTypes.func,     // setShowFeedbackForm
};


export default FeedbackAndRatingForm;