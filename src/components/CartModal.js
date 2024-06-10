import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; 

const CartModal = ({ cartItems, setCartItems, removeItemFromCart, onClose }) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  // Calculate total discount
  const totalDiscount = cartItems.reduce((total, item) => total + (item.discount / 100) * item.quantity * item.price, 0);

  // Calculate total price after discount
  const totalPrice = subtotal - totalDiscount;

    // Define the updateCartItemQuantity function
    const updateCartItemQuantity = (index, newQuantity) => {
      const updatedCartItems = [...cartItems];
      updatedCartItems[index].quantity = newQuantity;
      setCartItems(updatedCartItems);
    };

      // Hook to access navigation functionality
  const navigate = useNavigate();

  // Function to handle proceeding to checkout
  const handleProceedToCheckout = () => {
    // Display toast message
    toast.success('Proceeding to checkout...');

    // Redirect the user to the checkout page with cart details as URL parameters
    navigate('/checkout', {
      state: { cartItems, subtotal, totalDiscount, totalPrice }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <header className="text-center">
          <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
        </header>
        <div className="mt-8">
          {cartItems && cartItems.length > 0 ? (
            <ul className="space-y-4">
              {cartItems.map((item, index) => (
                <li key={index} className="flex items-center gap-4">
                  <img
                    src={item.photo}
                    alt=""
                    className="size-16 rounded object-cover"
                  />

                  <div>
                    <h3 className="text-sm text-gray-900">{item.name}</h3>

                    <dl className="mt-0.5 space-y-px text-[10px] text-gray-600">
                      <div>
                        <dt className="inline">Description:</dt>
                        <dd className="inline">{item.description}</dd>
                      </div>
                      <div>
                        <dt className="inline">Tags:</dt>
                        <dd className="inline">{item.tags ? item.tags.join(', ') : ''}</dd>
                      </div>
                      <div>
                        <dd className="inline">PHP {item.price}</dd>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-1 items-center justify-end gap-2">
                    <form>
                      <label htmlFor={`Qty${index}`} className="sr-only"> Quantity </label>
                      <input
  type="number"
  min="1"
  value={item.quantity}
  onChange={(e) => updateCartItemQuantity(index, parseInt(e.target.value))}
  id={`Qty${index}`}
  className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
/>

                    </form>
                    <button onClick={() => removeItemFromCart(index)} className="text-gray-600 transition hover:text-red-600">
                      <span className="sr-only">Remove item</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
          
          {/* Cart summary */}
          <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
            <div className="w-screen max-w-lg space-y-4">
              <dl className="space-y-0.5 text-sm text-gray-700">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>PHP{subtotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Discount</dt>
                  <dd>-PHP{totalDiscount.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Total</dt>
                  <dd>PHP{totalPrice.toFixed(2)}</dd>
                </div>
              </dl>
            </div>
             {/* Proceed to Checkout button */}
          <div className="flex justify-center mt-4">
            <button onClick={handleProceedToCheckout} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Proceed to Checkout
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartModal;
