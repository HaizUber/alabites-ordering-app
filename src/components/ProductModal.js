import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ProductModal = ({ product, onClose, addToCart }) => {
    const [quantity, setQuantity] = useState(product.quantity);
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        console.log('Updated cart items:', cartItems);
    }, [cartItems]); // This will run whenever cartItems state changes

    const decrementQuantity = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    };

    const incrementQuantity = () => {
        setQuantity(quantity + 1);
    };

    const handleAddToCart = () => {
        const newItem = {
           id: product._id,
            pid: product.pid,
            name: product.name,
            quantity: quantity,
            price: product.price,
            discount: product.discount,
            description: product.description,
            tags: product.tags,
            photo: product.productPhotos[0]
        };
        addToCart(newItem); // Pass newItem to addToCart function
        onClose(); // Close modal after adding to cart
    };       
      
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"> {/* Adjusted max width to 4xl */}
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.store}</h2>
                <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{product.name}</h1>
                <div className="flex mb-4">
                  <a href="#" className="flex-grow text-indigo-500 border-b-2 border-indigo-500 py-2 text-lg px-1">Description</a>
                  <a href="#" className="flex-grow border-b-2 border-gray-300 py-2 text-lg px-1">Reviews</a>
                </div>
                <p className="leading-relaxed mb-4">{product.description}</p>
                <div class="flex border-t border-gray-200 py-2">
                 <span class="text-gray-500">Stock</span>
                 <span class="ml-auto text-gray-900">{product.stock}</span>
                </div>
                <div className="flex border-t border-b mb-6 border-gray-200 py-2">
      <span className="text-gray-500">Quantity</span>
      <div className="flex items-center rounded border border-gray-200 ml-auto">
        <button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={decrementQuantity}>
          &minus;
        </button>

        <input
          type="number"
          id="Quantity"
          value={quantity}
          className="h-10 w-16 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
          onChange={(e) => setQuantity(parseInt(e.target.value))}
        />

        <button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={incrementQuantity}>
          +
        </button>
      </div>
    </div>      
                <div className="flex">
                  <span className="title-font font-medium text-2xl text-gray-900">PHP {product.price}</span>
                  <button onClick={handleAddToCart} className="ml-4 text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded">
        Add to Cart
      </button>
                  <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                    <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>
                  </button>
                </div>
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
