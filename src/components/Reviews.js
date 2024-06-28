import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StarRating = ({
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    handleClick
}) => {
    const renderStar = (index) => {
        const isFull = index <= rating;
        const isHalf = index === Math.ceil(rating) && !Number.isInteger(rating);
        const isHovered = index <= hoverRating;

        return (
            <motion.span
                key={index}
                onMouseOver={() => setHoverRating(index)}
                onMouseOut={() => setHoverRating(0)}
                onClick={() => handleClick(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className={`cursor-pointer text-2xl ${
                    isFull || isHovered
                        ? 'text-yellow-500'
                        : isHalf
                        ? 'text-yellow-300'
                        : 'text-gray-300'
                }`}
            >
                {isFull || isHovered ? '★' : isHalf ? '★' : '☆'}
            </motion.span>
        );
    };

    return (
        <div>
            {[...Array(5)].map((_, i) => (
                <React.Fragment key={i}>
                    {renderStar(i + 1)}
                </React.Fragment>
            ))}
        </div>
    );
};

const Reviews = ({
    loadingReviews,
    reviews,
    reviewText,
    setReviewText,
    rating,
    setRating,
    handleAddReview
}) => {
    const maxCharacters = 500;
    const charactersLeft = maxCharacters - reviewText.length;
    const itemsPerPage = 5; // Number of reviews per page
    const [currentPage, setCurrentPage] = useState(1);
    const [hoverRating, setHoverRating] = useState(0); // State for hover rating

    // Calculate total pages based on reviews length and items per page
    const totalPages = Math.ceil(reviews.length / itemsPerPage);

    // Slice reviews array to get current page reviews
    const currentReviews = reviews.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSubmitReview = () => {
        if (!reviewText || rating === 0) {
            toast.error('Please write a review and select a rating.');
            return;
        }

        // Simulating a successful review submission
        handleAddReview();

        // Reset review text and rating
        setReviewText('');
        setRating(0);

        // Show success message
        toast.success('Review submitted successfully!');
    };

    const handleClick = (index) => {
        setRating(index);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold">Reviews</h2>
            {loadingReviews ? (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    Loading reviews...
                </motion.p>
            ) : currentReviews.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4"
                >
                    {currentReviews.map((review) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-b pb-2"
                        >
                            <p className="font-semibold">{review.user.username}</p>
                            <p className="text-yellow-500">
                                {'★'.repeat(Math.floor(review.rating)) +
                                    (review.rating % 1 ? '½' : '')}
                            </p>
                            <p>{review.comment}</p>
                        </motion.div>
                    ))}
                    {/* Pagination controls */}
                    <div className="flex justify-center mt-4 space-x-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-3 py-1 rounded ${
                                    currentPage === index + 1
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                {index + 1}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    No reviews yet.
                </motion.p>
            )}
            <div className="mt-4">
                <h3 className="text-xl font-semibold">Add a Review</h3>
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full border p-2 mt-2"
                    placeholder="Write your review here..."
                    maxLength={maxCharacters}
                />
                <div className="text-right text-sm text-gray-500">
                    {charactersLeft} characters left
                </div>
                <div className="flex items-center mt-2">
                    <label htmlFor="rating" className="mr-2">Rating:</label>
                    <StarRating
                        rating={rating}
                        setRating={setRating}
                        hoverRating={hoverRating}
                        setHoverRating={setHoverRating}
                        handleClick={handleClick}
                    />
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitReview}
                    disabled={!reviewText || rating === 0}
                    className={`bg-indigo-500 text-white px-4 py-2 mt-2 rounded transition-transform duration-300 ${(!reviewText || rating === 0) && 'opacity-50 cursor-not-allowed'}`}
                >
                    Submit Review
                </motion.button>
            </div>
        </div>
    );
};

export default Reviews;
