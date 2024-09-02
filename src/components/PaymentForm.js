import React, { useState } from 'react';
import '../styles/PaymentForm.css'; // Import CSS for animations
import { useSpring, animated } from 'react-spring'; // Import react-spring hooks

const PaymentForm = ({ paymentMethod, setPaymentMethod, handlePayment, isLoading }) => {
  const [cardDetails, setCardDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({
    cardholderName: '',
    cardNumber: '',
    expDate: '',
    cvc: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Remove spaces from card number input
    if (name === 'cardNumber') {
      const cardNumberWithoutSpaces = value.replace(/\s/g, '');
      setCardDetails({ ...cardDetails, [name]: cardNumberWithoutSpaces });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }

    setErrors({ ...errors, [name]: '' }); // Clear error message when input changes
  };

  // Animation for form elements
  const formSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 500 }
  });

  // Function to handle payment with TamCredits
  const handleTamCreditsPayment = () => {
    // Update payment method state without initiating payment
    setPaymentMethod('tamcredits');
  };

    // Function to handle payment with Pay at Counter
    const handlePayAtCounterPayment = () => {
      setPaymentMethod('payatcounter');
    };

  // Function to validate the form fields
  const validateForm = () => {
    let valid = true;
    const today = new Date();
    const enteredDate = new Date(`${cardDetails.expYear}-${cardDetails.expMonth}-01`);

    // Check if all fields are filled out (only if payment method is 'card')
    if (paymentMethod === 'card') {
      Object.keys(cardDetails).forEach(key => {
        if (cardDetails[key] === '') {
          setErrors(prevErrors => ({
            ...prevErrors,
            [key]: `${key === 'cardNumber' ? 'Card number' : key} is required`
          }));
          valid = false;
        }
      });

      // Validate expiration date (only if payment method is 'card')
      if (enteredDate < today) {
        setErrors(prevErrors => ({
          ...prevErrors,
          expDate: 'Expiration date must be in the future'
        }));
        valid = false;
      }

      // Validate card number (simple validation, adjust as per your needs)
      const cardNumberPattern = /^\d{16}$/;
      if (!cardNumberPattern.test(cardDetails.cardNumber)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          cardNumber: 'Invalid card number'
        }));
        valid = false;
      }

      // Validate CVC (simple validation, adjust as per your needs)
      const cvcPattern = /^\d{3}$/;
      if (!cvcPattern.test(cardDetails.cvc)) {
        setErrors(prevErrors => ({
          ...prevErrors,
          cvc: 'Invalid CVC'
        }));
        valid = false;
      }
    }

    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (validateForm()) {
      handlePayment(cardDetails);
    }
  };

  return (
    <animated.div style={formSpring} className="px-3 md:w-5/12">
      <form onSubmit={handleSubmit} className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-3 text-gray-800 font-light mb-6">
        <div className="w-full p-3 border-b border-gray-200">
          <div className="mb-5">
            <label className="flex items-center cursor-pointer">
              <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="paymentMethod" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
              <span className="ml-2 text-gray-700">Pay with Card</span>
            </label>
          </div>
          <div className="mb-5">
            <label className="flex items-center cursor-pointer">
              <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="paymentMethod" checked={paymentMethod === 'tamcredits'} onChange={handleTamCreditsPayment} />
              <span className="ml-2 text-gray-700">Pay with TamCredits</span>
            </label>
          </div>
          <div className="mb-5">
            <label className="flex items-center cursor-pointer">
              <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="paymentMethod" checked={paymentMethod === 'payatcounter'} onChange={handlePayAtCounterPayment} />
              <span className="ml-2 text-gray-700">Pay at Counter</span>
            </label>
          </div>
          {paymentMethod === 'card' && (
            <>
              <animated.div style={formSpring}>
                <div className="mb-3">
                  <img 
                    src="https://s3-us-west-2.amazonaws.com/cbi-image-service-prd/modified/57f0232d-6e1e-47a3-8686-ff43fcca79b9.png" 
                    alt="Payment Icon" 
                    style={{ width: '180px', height: '50px' }} 
                  />
                  <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Name on card</label>
                  <input
                    className={`w-full px-3 py-2 mb-1 border ${errors.cardholderName ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-indigo-500 transition-colors`}
                    placeholder="John Smith"
                    type="text"
                    name="cardholderName"
                    value={cardDetails.cardholderName}
                    onChange={handleChange}
                  />
                  {errors.cardholderName && <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>}
                </div>
                <div className="mb-3">
                  <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Card number</label>
                  <input
                    className={`w-full px-3 py-2 mb-1 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-indigo-500 transition-colors`}
                    placeholder="0000 0000 0000 0000"
                    type="text"
                    name="cardNumber"
                    value={cardDetails.cardNumber}
                    onChange={handleChange}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
                </div>
                <div className="mb-3 -mx-2 flex items-end">
                  <div className="px-2 w-1/4">
                    <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Exp Month</label>
                    <select
                      className={`form-select w-full px-3 py-2 mb-1 border ${errors.expDate ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer`}
                      name="expMonth"
                      value={cardDetails.expMonth}
                      onChange={handleChange}
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="px-2 w-1/4">
                    <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">Exp Year</label>
                    <select
                      className={`form-select w-full px-3 py-2 mb-1 border ${errors.expDate ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer`}
                      name="expYear"
                      value={cardDetails.expYear}
                      onChange={handleChange}
                    >
                      <option value="">YY</option>
                      {Array.from({ length: 10 }, (_, i) => (
                        <option key={i + 2021} value={i + 2021}>
                          {i + 2021}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="px-2 w-1/2">
                    <label className="text-gray-600 font-semibold text-sm mb-2 ml-1">CVC</label>
                    <input
                      className={`w-full px-3 py-2 mb-1 border ${errors.cvc ? 'border-red-500' : 'border-gray-200'} rounded-md focus:outline-none focus:border-indigo-500 transition-colors`}
                      placeholder="CVC"
                      type="text"
                      name="cvc"
                      value={cardDetails.cvc}
                      onChange={handleChange}
                    />
                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                  </div>
                </div>
              </animated.div>
            </>
          )}
          <div className="mt-5">
            <button
              type="submit"
              className="block w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-lg px-4 py-3 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'PAY NOW'}
            </button>
          </div>
        </div>
      </form>
    </animated.div>
  );
};

export default PaymentForm;
