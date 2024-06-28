import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { motion } from 'framer-motion'; // Import framer-motion


const TopupPage = () => {
  const [uid, setUid] = useState('');
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPredefinedAmount, setSelectedPredefinedAmount] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState(false);
  const [error, setError] = useState(null);

  const predefinedAmounts = [250, 500, 750, 1000, 1250];

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userIdResponse = await axios.get('https://alabites-api.vercel.app/users');
          const currentUserData = userIdResponse.data.data.find((userData) => userData.email === currentUser.email);
          if (!currentUserData) throw new Error('User not found');
          setUid(currentUserData.uid);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    });
  }, []);

  const handleAmountSelection = (amount) => {
    setSelectedPredefinedAmount(amount);
    setConfirmAmount(true);
  };

  const handleConfirmation = () => {
    setShowModal(true);
    setConfirmAmount(false);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);
    toast.info('Processing payment...');

    try {
      const PAYMONGO_SECRET_KEY = process.env.REACT_APP_PAYMONGO_SECRET_KEY;

      if (!cardNumber || !expMonth || !expYear || !cvc || !cardholderName) {
        const missingFields = [];
        if (!cardNumber) missingFields.push('Card Number');
        if (!expMonth) missingFields.push('Expiration Month');
        if (!expYear) missingFields.push('Expiration Year');
        if (!cvc) missingFields.push('Security Code');
        if (!cardholderName) missingFields.push('Name on Card');

        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsLoading(false);
        return;
      }

      const paymentMethodResponse = await axios.post('https://api.paymongo.com/v1/payment_methods', {
        data: {
          attributes: {
            type: 'card',
            details: {
              card_number: cardNumber.replace(/\s+/g, ''),
              exp_month: parseInt(expMonth, 10),
              exp_year: parseInt(expYear, 10),
              cvc,
              billing: { name: cardholderName },
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
            amount: parseInt(selectedPredefinedAmount || amount) * 100,
            payment_method_allowed: ['card'],
            currency: 'PHP',
            description: 'Adding credits',
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

      const paymentIntentId = paymentIntentResponse.data.data.id;

      await axios.post(`https://api.paymongo.com/v1/payment_intents/${paymentIntentId}/attach`, {
        data: {
          attributes: { payment_method: paymentMethodId },
        },
      }, {
        headers: {
          Authorization: `Basic ${btoa(PAYMONGO_SECRET_KEY)}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Payment successful!');
      setShowModal(false);
      await handleAddTamCredits();

    } catch (error) {
      setError(error.message);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTamCredits = async () => {
    try {
      const response = await axios.post(`https://alabites-api.vercel.app/admins/${uid}/add-currency`, {
        uid,
        amount: selectedPredefinedAmount || amount,
        description: 'Adding credits',
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      console.log('Tam credits added successfully:', response.data);
      toast.success('Tam credits added successfully!');
    } catch (error) {
      console.error('Error adding Tam credits:', error);
      toast.error('Error adding Tam credits.');
    }
  };

  return (
    <motion.section
      className="text-gray-600 body-font bg-gray-50 min-h-screen flex justify-center items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container px-5 py-24 mx-auto">
        <motion.div className="flex flex-wrap -m-4 text-center">
          {predefinedAmounts.map((predefinedAmount) => (
            <motion.div
              key={predefinedAmount}
              className="p-4 sm:w-1/2 lg:w-1/3 w-full transform transition hover:scale-105 duration-500"
              whileHover={{ scale: 1.05 }}
            >
              <div className="rounded-lg bg-white shadow-indigo-50 shadow-md">
                <div className="p-4">
                  <h2 className="text-gray-900 text-lg font-bold">Top Up Amount</h2>
                  <h3 className="mt-2 text-xl font-bold text-yellow-500 text-left">{predefinedAmount} PHP</h3>
                </div>
                <div className="flex justify-center items-center pb-4">
                  <button
                    onClick={() => handleAmountSelection(predefinedAmount)}
                    className="text-sm px-4 py-2 bg-yellow-400 text-white rounded-lg tracking-wider hover:bg-yellow-300 outline-none"
                  >
                    Select
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <ToastContainer />

        {confirmAmount && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Confirm Amount</h3>
              <p className="mb-4">You are about to top up {selectedPredefinedAmount || amount} PHP.</p>
              <div className="flex justify-end">
                <button
                  onClick={handleConfirmation}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-lg mr-2 transition hover:bg-yellow-300"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmAmount(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg transition hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 transition-opacity"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                Checkout via{' '}
                <img
                  src="https://th.bing.com/th/id/OIP.l-TAh-Y3NhgW26fiLmk-gAAAAA?rs=1&pid=ImgDetMain"
                  alt="Paymongo"
                  className="h-6 ml-3 inline-block"
                />
              </h3>
              <div>
                <label className="block mb-2" htmlFor="cardNumber">Card Number</label>
                <input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  placeholder="4444 4444 4444 4444"
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                  aria-label="Card Number"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div className="w-1/2 pr-2">
                  <label className="block mb-2" htmlFor="expMonth">Expiry Month</label>
                  <input
                    id="expMonth"
                    type="text"
                    value={expMonth}
                    placeholder="12"
                    onChange={(e) => setExpMonth(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                    aria-label="Expiry Month"
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block mb-2" htmlFor="expYear">Expiry Year</label>
                  <input
                    id="expYear"
                    type="text"
                    value={expYear}
                    placeholder="24"
                    onChange={(e) => setExpYear(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                    aria-label="Expiry Year"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block mb-2" htmlFor="cvc">CVC</label>
                <input
                  id="cvc"
                  type="text"
                  value={cvc}
                  placeholder="123"
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                  aria-label="CVC"
                />
              </div>
              <div className="mt-4">
                <label className="block mb-2" htmlFor="cardholderName">Cardholder Name</label>
                <input
                  id="cardholderName"
                  type="text"
                  value={cardholderName}
                  placeholder="John Smith"
                  onChange={(e) => setCardholderName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-yellow-500"
                  aria-label="Cardholder Name"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleCheckout}
                  className="bg-yellow-400 text-white px-4 py-2 rounded-lg mr-2 transition hover:bg-yellow-300"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-lg transition hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
              {error && (
                <div className="mt-4 text-red-500">
                  <p>{error}</p>
                </div>
              )}
              
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default TopupPage;
