import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const CheckoutPage = ({ clearCart }) => {
  const location = useLocation();
  const { cartItems, subtotal, totalDiscount, totalPrice } = location.state || { cartItems: [], subtotal: 0, totalDiscount: 0, totalPrice: 0 };

  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [purchasedItems, setPurchasedItems] = useState([]);
const navigate = useNavigate();
const [cardholderName, setCardholderName] = useState('');
const [isCardNameValid, setIsCardNameValid] = useState(false);

const handlePayment = async () => {
  // Check if any required fields are missing
  if (!cardNumber || !expMonth || !expYear || !cvc || !cardholderName) {
    const missingFields = [];
    if (!cardNumber) missingFields.push('Card Number');
    if (!expMonth) missingFields.push('Expiration Month');
    if (!expYear) missingFields.push('Expiration Year');
    if (!cvc) missingFields.push('Security Code');
    if (!cardholderName) missingFields.push('Name on Card');

    toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
    return;
  }

  setIsLoading(true);
  setError(null);
  toast.info('Processing payment...');

  try {
    const PAYMONGO_SECRET_KEY = process.env.REACT_APP_PAYMONGO_SECRET_KEY;

    const paymentMethodResponse = await axios.post('https://api.paymongo.com/v1/payment_methods', {
      data: {
        attributes: {
          type: 'card',
          details: {
            card_number: cardNumber.replace(/\s+/g, ''), // Remove spaces from card number
            exp_month: parseInt(expMonth, 10),  // Ensure exp_month is an integer
            exp_year: parseInt(expYear, 10),    // Ensure exp_year is an integer
            cvc,
            billing: {  // Add billing details including cardholder's name
              name: cardholderName // Include the cardholder's name here
            }
          },
        },
      },
    }, {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    const paymentMethodId = paymentMethodResponse.data.data.id;

    const paymentIntentResponse = await axios.post('https://api.paymongo.com/v1/payment_intents', {
      data: {
        attributes: {
          amount: totalPrice * 100, // Amount in centavos
          payment_method_allowed: ['card'],
          currency: 'PHP',
          description: cartItems.map(item => item.name).join(', '),
          statement_descriptor: 'Your Company Name',
          capture_type: 'automatic',
        },
      },
    }, {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    await axios.post(`https://api.paymongo.com/v1/payment_intents/${paymentIntentResponse.data.data.id}/attach`, {
      data: {
        attributes: {
          payment_method: paymentMethodId,
        },
      },
    }, {
      headers: {
        Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
        'Content-Type': 'application/json',
      },
    });

    for (const item of cartItems) {
      try {
        // Fetch the current stock of the product
        const response = await axios.get(`https://alabites-api.vercel.app/products/query/${item.pid}`);
        
        // Log the API response for debugging
        console.log('API Response:', response.data);
        
        // Validate response data structure
        if (response.data && response.data.message === 'Success' && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const product = response.data.data[0];
          if (product.stock !== undefined) {
            const currentStock = product.stock;
            const updatedStock = currentStock - item.quantity;
        
            console.log(`Product ID: ${item.pid}, Current Stock: ${currentStock}, Quantity to Deduct: ${item.quantity}`);
            console.log(`Updated Stock: ${updatedStock}`);
        
            // Update the stock using PATCH request
            await axios.patch(`https://alabites-api.vercel.app/products/${item.id}/stock`, {
              stock: updatedStock // Ensure you are sending the correct property
            });
        
            console.log(`Stock updated successfully for Product ID: ${item.pid}`);
          } else {
            console.error('Error updating stock: Stock property missing from response');
          }
        } else {
          console.error('Error updating stock: Invalid or empty response from API');
        }
      } catch (error) {
        // Detailed error logging
        console.error(`Error updating stock for Product ID: ${item.pid}`, error.response ? error.response.data : error.message);
      }
    }
        
    toast.success('Payment successful!');
    setShowModal(true);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);

    if (error.response && error.response.data && error.response.data.errors) {
      const errorDetail = error.response.data.errors[0].detail;
      toast.error(`Payment failed: ${errorDetail}`);
    } else {
      toast.error('Payment failed. Please try again.');
    }
  } finally {
    setIsLoading(false);
  }
};

const handleCloseModal = () => {
  setShowModal(false);
};

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 py-5">
      <div className="px-5">
        <div className="mb-2">
          <a href="#" className="focus:outline-none hover:underline text-gray-500 text-sm">
            <i className="mdi mdi-arrow-left text-gray-400"></i>Back
          </a>
        </div>
        <div className="mb-2">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-600">Checkout.</h1>
        </div>
        <div className="mb-5 text-gray-400">
          <a href="#" className="focus:outline-none hover:underline text-gray-500">Home</a> / 
          <a href="#" className="focus:outline-none hover:underline text-gray-500">Cart</a> / 
          <span className="text-gray-600">Checkout</span>
        </div>
      </div>
      <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
        <div className="w-full">
          <div className="-mx-3 md:flex items-start">
            <div className="px-3 md:w-7/12 lg:pr-10">
              <div className="w-full mx-auto text-gray-800 font-light mb-6 border-b border-gray-200 pb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="w-full flex items-center mb-4">
                    <div className="overflow-hidden rounded-lg w-16 h-16 bg-gray-50 border border-gray-200">
                      <img src={item.photo} alt={item.name} />
                    </div>
                    <div className="flex-grow pl-3">
                      <h6 className="font-semibold uppercase text-gray-600">{item.name}</h6>
                      <p className="text-gray-400">x {item.quantity}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-600 text-xl">PHP {item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-6 pb-6 border-b border-gray-200 text-gray-800">
                <div className="w-full flex mb-3 items-center">
                  <div className="flex-grow">
                    <span className="text-gray-600">Subtotal</span>
                  </div>
                  <div className="pl-3">
                    <span className="font-semibold">PHP {subtotal.toFixed(2)}</span>
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="flex-grow">
                    <span className="text-gray-600">Discount</span>
                  </div>
                  <div className="pl-3">
                    <span className="font-semibold">-PHP {totalDiscount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mb-6 pb-6 border-b border-gray-200 md:border-none text-gray-800 text-xl">
                <div className="w-full flex items-center">
                  <div className="flex-grow">
                    <span className="text-gray-600">Total</span>
                  </div>
                  <div className="pl-3">
                    <span className="font-semibold text-gray-400 text-sm">PHP</span> 
                    <span className="font-semibold"> {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-3 md:w-5/12">
              <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
                <div className="w-full flex mb-3 items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">Contact</span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>Scott Windon</span>
                  </div>
                </div>
                <div className="w-full flex items-center">
                  <div className="w-32">
                    <span className="text-gray-600 font-semibold">Billing Address</span>
                  </div>
                  <div className="flex-grow pl-3">
                    <span>123 George Street, Sydney, NSW 2000 Australia</span>
                  </div>
                </div>
              </div>
              <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
                <div className="w-full p-3 border-b border-gray-200">
                  <div className="mb-5">
                    <label htmlFor="type1" className="flex items-center cursor-pointer">
                      <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type1" defaultChecked/>
                      <img src="https://th.bing.com/th/id/OIP.l-TAh-Y3NhgW26fiLmk-gAAAAA?rs=1&pid=ImgDetMain" className="h-6 ml-3"/>
                    </label>
                  </div>
                  <div>
                    <div className="mb-3">
                      <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Name on card</label>
                      <div>
                      <input 
  className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" 
  placeholder="John Smith" 
  type="text"
  onChange={(e) => {
    const name = e.target.value;
    setCardholderName(name);
    setIsCardNameValid(!!name.trim()); // Set to true if the name is not empty after trimming
  }}
/>


                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Card number</label>
                      <div>
                        <input 
                          className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" 
                          placeholder="0000 0000 0000 0000" 
                          type="text"
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="mb-3 -mx-2 flex items-end">
                      <div className="px-2 w-1/4">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Expiration date</label>
                        <div>
                          <select 
                            className="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                            onChange={(e) => setExpMonth(e.target.value)}
                          >
                            <option value="01">01 - January</option>
                            <option value="02">02 - February</option>
                            <option value="03">03 - March</option>
                            <option value="04">04 - April</option>
                            <option value="05">05 - May</option>
                            <option value="06">06 - June</option>
                            <option value="07">07 - July</option>
                            <option value="08">08 - August</option>
                            <option value="09">09 - September</option>
                            <option value="10">10 - October</option>
                            <option value="11">11 - November</option>
                            <option value="12">12 - December</option>
                          </select>
                        </div>
                      </div>
                      <div className="px-2 w-1/4">
                        <select 
                          className="form-select w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                          onChange={(e) => setExpYear(e.target.value)}
                        >
                          <option value="2024">2024</option>
                          <option value="2025">2025</option>
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                          <option value="2029">2029</option>
                        </select>
                      </div>
                      <div className="px-2 w-1/4">
                        <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Security code</label>
                        <div>
                          <input 
                            className="w-full px-3 py-2 mb-1 border border-gray-200 rounded-md focus:outline-none focus:border-indigo-500 transition-colors" 
                            placeholder="000" 
                            type="text"
                            onChange={(e) => setCvc(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full p-3">
                  <label htmlFor="type2" className="flex items-center cursor-pointer">
                    <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" id="type2"/>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" width="80" className="ml-3"/>
                  </label>
                </div>
              </div>
              <div>
                <button 
                  className="block w-full max-w-xs mx-auto bg-indigo-500 hover:bg-indigo-700 focus:bg-indigo-700 text-white rounded-lg px-3 py-2 font-semibold" 
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  <i className="mdi mdi-lock-outline mr-1"></i> {isLoading ? 'Processing...' : 'PAY NOW'}
                </button>
                {error && <p className="text-red-500 mt-3">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showModal && (
  <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
    <div className="relative bg-white rounded-lg max-w-md w-full p-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Payment Successful!</h2>
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setShowModal(false)}
        >
          <svg
            className="h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M14.293 5.293a1 1 0 0 1 1.414 1.414L11.414 10l4.293 4.293a1 1 0 1 1-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 1 1-1.414-1.414L8.586 10 4.293 5.707a1 1 0 0 1 1.414-1.414L10 8.586l4.293-4.293z"
            />
          </svg>
        </button>
      </div>
      <p className="text-gray-600">Your payment has been successfully processed. Thank you for shopping with us!</p>
      <button
    className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none"
    onClick={() => {
      setShowModal(false);
      clearCart(); // Call the clearCart function to clear the cart
      navigate('/', { replace: true }); // Navigate back to the home page
    }}
  >
    Close
  </button>
    </div>
  </div>
)}
    </div>  
  );
}

export default CheckoutPage;
