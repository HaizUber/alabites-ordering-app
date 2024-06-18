import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import api from './api';

const ProductModal = ({ product, onClose, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [userId, setUserId] = useState(null); // Initialize userId state

    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUserId(user);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const fetchUserId = async (user) => {
        try {
            const userIdResponse = await axios.get(`https://alabites-api.vercel.app/users`);
            const currentUser = userIdResponse.data.data.find((userData) => userData.email === user.email);
            if (!currentUser) {
                throw new Error('User not found');
            }
            setUserId(currentUser._id);
        } catch (error) {
            console.error('Error fetching user ID:', error);
            toast.error('Failed to fetch user ID');
        }
    };

 // Function to fetch reviews for a specific product
 const fetchReviews = async () => {
  console.log('Fetching reviews...');
  setLoadingReviews(true);
  try {
      const response = await axios.get(`https://alabites-api.vercel.app/reviews/product/${product._id}`);
      console.log('Reviews fetched:', response.data);
      setReviews(response.data);
  } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
  } finally {
      setLoadingReviews(false);
  }
};

const handleAddReview = async () => {
  console.log('Adding review...');
  try {
      // Ensure userId is fetched before proceeding
      if (!userId) {
          throw new Error('User ID not available');
      }

      const response = await api.post('/reviews', {
          user: userId,
          product: product._id,
          rating,
          comment: reviewText
      });
      console.log('Review added:', response.data);
      toast.success('Review submitted successfully');
      // Fetch reviews again after submitting a new review
      fetchReviews();
  } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review');
  }
};

    useEffect(() => {
        if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [activeTab, product._id]);

    const handleAddToCart = () => {
        const newItem = {
            id: product._id,
            pid: product.pid,
            name: product.name,
            quantity,
            price: product.price,
            discount: product.discount,
            description: product.description,
            tags: product.tags,
            photo: product.productPhotos[0]
        };
        addToCart(newItem);
        onClose();
    };


    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                                <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.store}</h2>
                                <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{product.name}</h1>
                                <div className="flex mb-4">
                                    <a 
                                        href="#" 
                                        className={`flex-grow py-2 text-lg px-1 ${activeTab === 'description' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'border-b-2 border-gray-300'}`}
                                        onClick={() => setActiveTab('description')}
                                    >
                                        Description
                                    </a>
                                    <a 
                                        href="#" 
                                        className={`flex-grow py-2 text-lg px-1 ${activeTab === 'reviews' ? 'text-indigo-500 border-b-2 border-indigo-500' : 'border-b-2 border-gray-300'}`}
                                        onClick={() => setActiveTab('reviews')}
                                    >
                                        Reviews
                                    </a>
                                </div>
                                {activeTab === 'description' && (
                                    <div>
                                        <p className="leading-relaxed mb-4">{product.description}</p>
                                        <div className="flex border-t border-b mb-6 border-gray-200 py-2">
                                            <span className="text-gray-500">Quantity</span>
                                            <div className="flex items-center rounded border border-gray-200 ml-auto">
                                                <button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={decrementQuantity}>&minus;</button>
                                                <input
                                                    type="number"
                                                    id="Quantity"
                                                    value={quantity}
                                                    className="h-10 w-16 border-transparent text-center sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                                />
                                                <button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={incrementQuantity}>+</button>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            <span className="title-font font-medium text-2xl text-gray-900">PHP {product.price}</span>
                                            <button onClick={handleAddToCart} className="ml-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">Add to Cart</button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'reviews' && (
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
                                                className="bg-indigo-500 text-white px-4 py-2 mt-2 rounded"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src={product.productPhotos[0]} />
                        </div>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={onClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
