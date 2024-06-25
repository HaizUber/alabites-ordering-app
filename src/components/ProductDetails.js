import React from 'react';

const ProductDetails = ({ product, quantity, decrementQuantity, incrementQuantity, setQuantity, handleAddToCart }) => (
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
            <button onClick={handleAddToCart} className="ml-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded transition-transform duration-300">Add to Cart</button>
        </div>
    </div>
);

export default ProductDetails;
