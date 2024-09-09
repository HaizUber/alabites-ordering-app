import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';

const ProductDetails = ({
    product,
    quantity,
    decrementQuantity,
    incrementQuantity,
    setQuantity,
    handleAddToCart
}) => {
    const inputSpring = useSpring({
        to: { opacity: 1, transform: 'translateY(0)' },
        from: { opacity: 0, transform: 'translateY(50px)' },
        config: { tension: 300, friction: 20 }
    });

    const tags = product.tags ? product.tags[0].split(',').map(tag => tag.trim()) : [];

    // Format average rating to 1 decimal place
    const formattedRating = product.averageRating.toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
        >
<div className="flex flex-wrap mb-4">
    <p className="w-full leading-relaxed mb-4 text-gray-600">{product.description}</p>
    <div className="w-full sm:w-1/2">
        <p className="text-gray-600 mb-2">
            <span className="font-medium">Stock:</span> {product.stock}
        </p>
        {/* Display discount percentage if it exists */}
        {product.discount > 0 && (
            <p className="text-green-500 mb-2">
                <span className="font-medium">Discount:</span> {product.discount}% OFF
            </p>
        )}
    </div>
    <div className="w-full sm:w-1/2">
        <p className="text-gray-600 mb-2">
            <span className="font-medium">Average Rating:</span> {formattedRating}
        </p>
        <div className="flex flex-wrap mb-2">
            <span className="font-medium text-gray-600 mr-2">Tags:</span>
            {tags.map((tag, index) => (
                <span
                    key={index}
                    className="text-sm bg-gray-200 text-gray-800 rounded-full px-2 py-1 mr-2 mb-2"
                >
                    {tag}
                </span>
            ))}
        </div>
    </div>
</div>



            <animated.div style={inputSpring} className="flex border-t border-b mb-6 border-gray-200 py-2">
                <span className="text-gray-500">Quantity</span>
                <div className="flex items-center ml-auto">
                    <button
                        type="button"
                        className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
                        onClick={decrementQuantity}
                    >
                        &minus;
                    </button>
                    <input
                        type="number"
                        id="Quantity"
                        value={quantity}
                        className="h-10 w-16 border border-gray-200 text-center sm:text-sm mx-2"
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <button
                        type="button"
                        className="size-10 leading-10 text-gray-600 transition hover:opacity-75"
                        onClick={incrementQuantity}
                    >
                        +
                    </button>
                </div>
            </animated.div>

            <div className="flex items-center">
    {/* Calculate discounted price */}
    {product.discount > 0 ? (
        <>
            <span className="text-gray-600 line-through mr-2">PHP {product.price.toFixed(2)}</span>
            <span className="title-font font-medium text-2xl text-gray-900">
                PHP {(product.price * (1 - product.discount / 100)).toFixed(2)}
            </span>
        </>
    ) : (
        <span className="title-font font-medium text-2xl text-gray-900">
            PHP {product.price.toFixed(2)}
        </span>
    )}
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleAddToCart}
        className="ml-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded transition-transform duration-300"
    >
        Add to Cart
    </motion.button>
</div>

        </motion.div>
    );
};

export default ProductDetails;
