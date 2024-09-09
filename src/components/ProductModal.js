import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from './api';
import ProductDetails from './ProductDetails';
import Reviews from './Reviews';
import LazyLoad from 'react-lazyload';
import { motion } from 'framer-motion';

const ProductModal = ({ product, onClose, addToCart }) => {
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [userId, setUserId] = useState(null);
    const [productPhotos, setProductPhotos] = useState(product.productPhotos);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [insufficientStock, setInsufficientStock] = useState(false);
    const [storeName, setStoreName] = useState(''); // State to store the store name
    const [storePicture, setStorePicture] = useState(''); // State to store the store picture

    const auth = getAuth();
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchStoreDetails = async () => {
            const storeUrl = `https://alabites-api.vercel.app/store/${product.store}`;
            
            console.log('Requesting store details from URL:', storeUrl); // Log the full URL being used
            
            try {
                const response = await axios.get(storeUrl);
                
                console.log('API Response:', response); // Log the full response object
                
                // Log the entire response data
                console.log('Full Response Data:', response.data);
                
                // Check the structure of the response data
                console.log('Keys in Response Data:', Object.keys(response.data));
                
                // Extract store details from the nested data
                const { storeName, storepicture } = response.data.data;
                
                // Log the store details before setting them in the state
                console.log('Store Name:', storeName);
                console.log('Store Picture:', storepicture);
                
                // Set the store details in the state
                setStoreName(storeName);
                setStorePicture(storepicture);
                
            } catch (error) {
                console.error('Error fetching store details:', error);
                toast.error('Failed to fetch store details. Please try again later.');
            }
        };
    
        if (product.store) {
            fetchStoreDetails();
        }
    }, [product.store]);
    useEffect(() => {
        const fetchStoreDetails = async () => {
            const storeUrl = `https://alabites-api.vercel.app/store/${product.store}`;
            
            console.log('Requesting store details from URL:', storeUrl); // Log the full URL being used
            
            try {
                const response = await axios.get(storeUrl);
                
                console.log('API Response:', response); // Log the full response object
                
                // Log the entire response data
                console.log('Full Response Data:', response.data);
                
                // Check the structure of the response data
                console.log('Keys in Response Data:', Object.keys(response.data));
                
                // Extract store details from the nested data
                const { storeName, storepicture } = response.data.data;
                
                // Log the store details before setting them in the state
                console.log('Store Name:', storeName);
                console.log('Store Picture:', storepicture);
                
                // Set the store details in the state
                setStoreName(storeName);
                setStorePicture(storepicture);
                
            } catch (error) {
                console.error('Error fetching store details:', error);
                toast.error('Failed to fetch store details. Please try again later.');
            }
        };
    
        if (product.store) {
            fetchStoreDetails();
        }
    }, [product.store]);
        
    
    

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
            toast.error('Failed to fetch user ID. Please try again later.');
        }
    };

    const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
            const response = await axios.get(`https://alabites-api.vercel.app/reviews/product/${product._id}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews. Please try again later.');
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
            toast.error('Failed to add review. Please try again later.');
        }
    };

    useEffect(() => {
        if (activeTab === 'reviews') {
            fetchReviews();
        }
    }, [activeTab, product._id]);

    const handleAddToCart = () => {
        if (!userId) {
            toast.error('Please log in to add items to your cart.');
            navigate('/login/student');
            return;
        }

        if (product.stock < quantity || product.stock === 0) {
            setInsufficientStock(true);
            toast.error('Insufficient stock to add to cart.');
            return;
        }

        const newItem = {
            id: product._id,
            pid: product.pid,
            name: product.name,
            quantity,
            price: product.price,
            discount: product.discount,
            description: product.description,
            tags: product.tags,
            photo: productPhotos[selectedPhotoIndex],
            store: product.store
        };
        addToCart(newItem);
        onClose();
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setInsufficientStock(false); // Reset insufficient stock indicator when quantity changes
        }
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
        setInsufficientStock(false); // Reset insufficient stock indicator when quantity changes
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
                            <h2 className="flex items-center space-x-2 text-sm title-font text-gray-500 tracking-widest">
  <img
    src={storePicture}
    alt={storeName}
    className="w-8 h-8 rounded-full object-cover"
  />
  <span>{storeName}</span>
</h2>

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
                                {insufficientStock && (
                                    <p className="text-red-500 mt-2">Insufficient stock to add to cart.</p>
                                )}
                            </div>
                            <div className="lg:w-1/2 w-full lg:h-auto">
                                <div className="flex justify-center items-center h-full">
                                    <div className="max-w-full">
                                        <LazyLoad height={400} once>
                                            <motion.img
                                                alt={`Product Photo`}
                                                className="w-full h-auto object-contain rounded-lg"
                                                src={productPhotos[selectedPhotoIndex]}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </LazyLoad>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-2 mt-4">
                                    {productPhotos.map((photo, index) => (
                                        <motion.div
                                            key={index}
                                            className={`relative overflow-hidden rounded-lg cursor-pointer transform transition-transform duration-300 hover:scale-105 ${index === selectedPhotoIndex ? 'border-2 border-indigo-500' : ''}`}
                                            onClick={() => setSelectedPhotoIndex(index)}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <LazyLoad height={100} once>
                                                <img
                                                    alt={`Product Photo ${index + 1}`}
                                                    className="w-full h-full object-cover rounded"
                                                    src={photo}
                                                />
                                            </LazyLoad>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            onClick={onClose}
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition-transform duration-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
