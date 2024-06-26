// OrderSummary.js
import React from 'react';
import { useSpring, animated } from 'react-spring'; // Import react-spring hooks
import '../styles/OrderSummary.css'; // Import CSS for animations

const OrderSummary = ({ cartItems, subtotal, totalDiscount, totalPrice }) => {
  // Animation for total price
  const totalSpring = useSpring({
    from: { value: 0 },
    to: { value: totalPrice },
    config: { duration: 1000 }, // Animation duration in milliseconds
  });

  return (
    <div className="px-3 md:w-7/12">
      <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
        {/* Cart Items */}
        <div className="mb-6 pb-6 border-b border-gray-200">
          <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Cart Items</label>
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center mb-4 cart-item">
              <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
                <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow pl-3">
                <h6 className="font-semibold text-gray-600">{item.name}</h6>
                <p className="text-gray-400">x {item.quantity}</p>
              </div>
              <div>
                <span className="font-semibold text-gray-600">PHP {item.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-right flex-grow">
            <label className="text-gray-600 font-semibold text-sm mb-2">Subtotal</label>
          </div>
          <div className="ml-4">
            <span>PHP {subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Discount */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-right flex-grow">
            <label className="text-gray-600 font-semibold text-sm mb-2">Discount</label>
          </div>
          <div className="ml-4">
            <span>-PHP {totalDiscount.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between">
          <div className="text-right flex-grow">
            <label className="text-gray-600 font-semibold text-sm mb-2">Total</label>
          </div>
          <div className="ml-4">
            <animated.span>
              {totalSpring.value.interpolate((val) => `PHP ${val.toFixed(2)}`)}
            </animated.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
