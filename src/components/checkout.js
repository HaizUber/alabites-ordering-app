import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import OrderSuccessModal from './OrderSuccessModal';
import LoadingModal from './CheckoutModal';
import { handleTamCreditsPayment, updateUserTamCreditsBalance, handleCardPayment, handlePayAtCounterPayment, generateOrderId, addTransactionToUser, checkProductStock } from './utils';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CheckoutPage = ({ cartItems, setCartItems }) => { // Add setCartItems prop
  const location = useLocation();
  const { selectedItems, subtotal, totalDiscount, totalPrice } = location.state || { selectedItems: [], subtotal: 0, totalDiscount: 0, totalPrice: 0 };
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method
  const [userData, setUserData] = useState(null); // State to store user details

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        fetchUserDetails(user.email);
      } else {
        setUserData(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const fetchUserDetails = async (email) => {
    try {
      const response = await axios.get(`https://alabites-api.vercel.app/users/query/${email}`);
      const userData = response.data.data[0];
      if (!userData) {
        throw new Error('User not found');
      }
      setUserData(userData);
    } catch (error) {
      toast.error('Failed to fetch user details');
      setUserData(null);
    }
  };

  const removeCheckedOutItems = () => {
    setCartItems((prevItems) => prevItems.filter(item => !selectedItems.some(selected => selected.id === item.id)));
  };

  const handlePayment = async (cardDetails) => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setLoadingMessage('Processing payment...');
    setError(null);
    toast.info('Processing payment...');

    let orderId = generateOrderId();

    try {
      if (!userData) {
        throw new Error('User details not available');
      }

      setLoadingMessage('Checking stock availability...');
      const stockAvailable = await checkProductStock(selectedItems);
      if (!stockAvailable) {
        throw new Error('Some products are out of stock');
      }

      let paymentIntentResponse;

      if (paymentMethod === 'tamcredits') {
        setLoadingMessage('Updating TamCredits balance...');
        await updateUserTamCreditsBalance(userData, totalPrice);
        setLoadingMessage('Processing TamCredits payment...');
        await handleTamCreditsPayment(userData, selectedItems);
        await addTransactionToUser(userData.uid, totalPrice, orderId, selectedItems, 'tamcredits');
      } else if (paymentMethod === 'payatcounter') {
        setLoadingMessage('Processing Order ID for Pay at Counter payment...');
        await handlePayAtCounterPayment(userData, selectedItems, totalPrice);
        await addTransactionToUser(userData.uid, totalPrice, orderId, selectedItems, 'payatcounter');
      } else {
        setLoadingMessage('Processing card payment...');
        paymentIntentResponse = await handleCardPayment(userData, cardDetails, selectedItems, totalPrice);

        if (!paymentIntentResponse || !paymentIntentResponse.data) {
          throw new Error('Payment intent response not received');
        }

        setLoadingMessage('Adding transaction...');
        await addTransactionToUser(userData.uid, totalPrice, orderId, selectedItems, 'card');
      }

      toast.success('Payment successful!');
      removeCheckedOutItems(); // Remove checked-out items from cart
      setShowModal(true);
    } catch (error) {
      setError('Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div className="min-w-screen min-h-screen bg-gray-50 py-5">
      <ToastContainer />
      <div className="px-5">
        <div className="mb-2">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-600">Checkout</h1>
        </div>
      </div>
      <div className="w-full bg-white border-t border-b border-gray-200 px-5 py-10 text-gray-800">
        <div className="w-full">
          <div className="-mx-3 md:flex items-start">
            <OrderSummary 
              cartItems={selectedItems}
              subtotal={subtotal}
              totalDiscount={totalDiscount}
              totalPrice={totalPrice}
            />
            <PaymentForm 
              paymentMethod={paymentMethod} 
              setPaymentMethod={setPaymentMethod} 
              handlePayment={handlePayment} 
              isLoading={isLoading} 
            />
          </div>
        </div>
      </div>
      {showModal && <OrderSuccessModal handleCloseModal={handleCloseModal} />}
      <LoadingModal isVisible={isLoading} message={loadingMessage} />
    </div>
  );
};

export default CheckoutPage;
