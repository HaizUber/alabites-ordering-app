import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';

const CartItem = ({ item, index, updateCartItemQuantity, removeItemFromCart }) => (
  <li className="flex items-center gap-4">
    <img src={item.photo} alt={item.name} className="w-16 h-16 rounded object-cover" />
    <div>
      <h3 className="text-sm text-gray-900">{item.name}</h3>
      <dl className="mt-0.5 space-y-px text-xs text-gray-600">
        <div>
          <dt className="inline">Description:</dt>
          <dd className="inline ml-1">{item.description}</dd>
        </div>
        <div>
          <dt className="inline">Tags:</dt>
          <dd className="inline ml-1">{item.tags ? item.tags.join(', ') : ''}</dd>
        </div>
        <div>
          <dd className="inline"> PHP {item.price.toFixed(2)}</dd>
        </div>
      </dl>
    </div>
    <div className="flex items-center justify-end gap-2 flex-1">
      <input
        type="number"
        min="1"
        value={item.quantity}
        onChange={(e) => updateCartItemQuantity(index, parseInt(e.target.value))}
        className="w-12 h-8 px-2 rounded border border-gray-200 bg-gray-50 text-center text-xs text-gray-600 focus:outline-none"
        aria-label={`Change quantity of ${item.name}`}
      />
      <button onClick={() => removeItemFromCart(index)} className="text-gray-600 hover:text-red-600">
        <span className="sr-only">Remove item</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </li>
);

const CartModal = ({ cartItems, setCartItems, removeItemFromCart, onClose }) => {
  const navigate = useNavigate();

  const subtotal = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity * item.price, 0),
    [cartItems]
  );

  const totalDiscount = useMemo(
    () => cartItems.reduce(
      (total, item) => total + ((item.discount / 100) * item.quantity * item.price),
      0
    ),
    [cartItems]
  );

  const totalPrice = useMemo(() => subtotal - totalDiscount, [subtotal, totalDiscount]);

  const updateCartItemQuantity = (index, newQuantity) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    setCartItems(updatedCartItems);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout', {
      state: { cartItems, subtotal, totalDiscount, totalPrice }
    });
    onClose(); // Close the modal after navigating
  };

  // Animation for total price
  const { number } = useSpring({ number: totalPrice, from: { number: 0 }, config: { tension: 170, friction: 26 } });

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white p-6 rounded shadow-md max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        role="dialog"
        aria-modal="true"
      >
        <header className="text-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
        </header>
        <div className="mt-8">
          {cartItems && cartItems.length > 0 ? (
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  index={index}
                  updateCartItemQuantity={updateCartItemQuantity}
                  removeItemFromCart={removeItemFromCart}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}

          <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
            <div className="space-y-4 max-w-lg">
              <div className="flex justify-between">
                <span>Subtotal </span>
                <span> PHP {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>-PHP {totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <animated.span>
                  {number.to((n) => `PHP ${n.toFixed(2)}`)}
                </animated.span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={handleProceedToCheckout}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CartModal;
