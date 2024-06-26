import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import api from './api';
import ProductDetails from './ProductDetails';
import Reviews from './Reviews';

const ProductModal = ({ product, onClose, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [userId, setUserId] = useState(null);

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

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await axios.get(`https://alabites-api.vercel.app/reviews/product/${product._id}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleAddReview = async () => {
        try {
            if (!userId) {
                throw new Error('User ID not available');
            }

            const response = await api.post('/reviews', {
                user: userId,
                product: product._id,
                rating,
                comment: reviewText
            });
            toast.success('Review submitted successfully');
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
            photo: product.productPhotos[0],
            store:product.store
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
        <div className="fixed inset-0 z-50 overflow-y-auto transition-opacity duration-300">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity duration-300" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0 transition-transform duration-500">
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
                                    <ProductDetails 
                                        product={product}
                                        quantity={quantity}
                                        decrementQuantity={decrementQuantity}
                                        incrementQuantity={incrementQuantity}
                                        setQuantity={setQuantity}
                                        handleAddToCart={handleAddToCart}
                                    />
                                )}
                                {activeTab === 'reviews' && (
                                    <Reviews
                                        loadingReviews={loadingReviews}
                                        reviews={reviews}
                                        reviewText={reviewText}
                                        setReviewText={setReviewText}
                                        rating={rating}
                                        setRating={setRating}
                                        handleAddReview={handleAddReview}
                                    />
                                )}
                            </div>
                            <img alt="ecommerce" className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded transition-transform duration-500" src={product.productPhotos[0]} />
                        </div>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={onClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-transform duration-300">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
