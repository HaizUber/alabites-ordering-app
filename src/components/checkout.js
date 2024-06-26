// CheckoutPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PaymentForm from './PaymentForm';
import OrderSummary from './OrderSummary';
import OrderSuccessModal from './OrderSuccessModal';
import LoadingModal from './CheckoutModal';
import { handleTamCreditsPayment, updateUserTamCreditsBalance, handleCardPayment, generateOrderId, addTransactionToUser, checkProductStock } from './utils'; // Ensure correct imports
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const CheckoutPage = ({ clearCart }) => {
  const location = useLocation();
  const { cartItems, subtotal, totalDiscount, totalPrice } = location.state || { cartItems: [], subtotal: 0, totalDiscount: 0, totalPrice: 0 };

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('card'); // Default payment method
  const [userData, setUserData] = useState(null); // State to store user details

  const auth = getAuth();

  useEffect(() => {
    console.log('Setting up auth state listener');

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed');

      if (user) {
        console.log('User is authenticated');
        try {
          console.log(`Fetching user details for email: ${user.email}`);
          fetchUserDetails(user.email);
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast.error('Failed to fetch user details');
          setUserData(null);
        }
      } else {
        console.log('User is signed out');
        setUserData(null);
      }
    });

    console.log('Subscribed to auth state changes');

    return () => {
      unsubscribe();
      console.log('Unsubscribed from auth state changes');
    };
  }, [auth]);

  const fetchUserDetails = async (email) => {
    console.log(`Fetching user details for email: ${email}`);

    try {
      console.log(`Making API request to: https://alabites-api.vercel.app/users/query/${email}`);
      const response = await axios.get(`https://alabites-api.vercel.app/users/query/${email}`);
      console.log('API Response:', response.data);

      const userData = response.data.data[0];
      if (!userData) {
        console.error('User not found in API response');
        throw new Error('User not found');
      }

      console.log('User details fetched successfully:', userData);
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to fetch user details');
      setUserData(null);
    }
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
  
      // Check stock availability
      setLoadingMessage('Checking stock availability...');
      const stockAvailable = await checkProductStock(cartItems);
      if (!stockAvailable) {
        throw new Error('Some products are out of stock');
      }
  
      let paymentIntentResponse;
  
      if (paymentMethod === 'tamcredits') {
        setLoadingMessage('Updating TamCredits balance...');
        await updateUserTamCreditsBalance(userData, totalPrice);
        setLoadingMessage('Processing TamCredits payment...');
        await handleTamCreditsPayment(userData, cartItems);
        await addTransactionToUser(userData.uid, totalPrice, orderId, cartItems, 'tamcredits');
      } else {
        setLoadingMessage('Processing card payment...');
        paymentIntentResponse = await handleCardPayment(userData, cardDetails, cartItems, totalPrice);
  
        if (!paymentIntentResponse || !paymentIntentResponse.data) {
          throw new Error('Payment intent response not received');
        }
  
        setLoadingMessage('Adding transaction...');
        await addTransactionToUser(userData.uid, totalPrice, orderId, cartItems, 'card');
      }
  
      const orderPayload = {
        orderNumber: orderId,
        customer: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        },
        items: cartItems.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          store: item.store,
        })),
        paymentDetails: {
          method: paymentMethod,
          transactionId: paymentMethod === 'tamcredits' ? orderId : paymentIntentResponse.data.data.id,
          amount: totalPrice,
        },
        totalAmount: totalPrice,
        orderStatus: 'Pending',
        store: cartItems.length > 0 ? cartItems[0].store : '',
      };
  
      const orderResponse = await axios.post('https://alabites-api.vercel.app/orders', orderPayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      console.log("Order response:", orderResponse.data);
      toast.success('Payment successful!');
      setShowModal(true);
  
      // Clear cart after successful purchase
      clearCart();
    } catch (error) {
      console.error("Error handling payment:", error);
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

  console.log('Cart Items:', cartItems);

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
            <OrderSummary cartItems={cartItems} subtotal={subtotal} totalDiscount={totalDiscount} totalPrice={totalPrice} />
            <PaymentForm paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} handlePayment={handlePayment} isLoading={isLoading} />
          </div>
        </div>
      </div>
      {showModal && <OrderSuccessModal handleCloseModal={handleCloseModal} />}
      <LoadingModal isVisible={isLoading} message={loadingMessage} />
    </div>
  );
};

export default CheckoutPage;
