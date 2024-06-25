import React from 'react';

const Reviews = ({ loadingReviews, reviews, reviewText, setReviewText, rating, setRating, handleAddReview }) => (
    <div>
        <h2 className="text-2xl font-bold">Reviews</h2>
        {loadingReviews ? (
            <p>Loading reviews...</p>
        ) : reviews.length > 0 ? (
            <div className="space-y-4">
                {reviews.map(review => (
                    <div key={review._id} className="border-b pb-2">
                        <p className="font-semibold">{review.user.username}</p>
                        <p>{'★'.repeat(review.rating)}</p>
                        <p>{review.comment}</p>
                    </div>
                ))}
            </div>
        ) : (
            <p>No reviews yet.</p>
        )}
        <div className="mt-4">
            <h3 className="text-xl font-semibold">Add a Review</h3>
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border p-2 mt-2"
                placeholder="Write your review here..."
            />
            <div className="flex items-center mt-2">
                <label htmlFor="rating" className="mr-2">Rating:</label>
                <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="border p-2"
                >
                    <option value="0">Select Rating</option>
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                    ))}
                </select>
            </div>
            <button
                onClick={handleAddReview}
                className="bg-indigo-500 text-white px-4 py-2 mt-2 rounded transition-transform duration-300"
            >
                Submit Review
            </button>
        </div>
    </div>
);

export default Reviews;
