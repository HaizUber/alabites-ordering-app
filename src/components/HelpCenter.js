import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';
import { motion } from 'framer-motion';
import { FaQuestionCircle, FaUserCircle, FaShippingFast, FaUndo, FaEnvelope } from 'react-icons/fa';

const HelpCenter = () => {
  const [faqOpen, setFaqOpen] = useState(null);
  const [selectedSection, setSelectedSection] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');

  const handleFaqToggle = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const fade = useSpring({
    opacity: faqOpen !== null ? 1 : 0,
    transform: faqOpen !== null ? 'translateY(0)' : 'translateY(-20px)',
    config: { duration: 300 }
  });

  const faqItems = [
    { question: "How do I place an order?", answer: "To place an order, simply browse our menu, select the items you want, and proceed to checkout." },
    { question: "What payment methods are accepted?", answer: "We accept various payment methods including credit/debit cards and TamCredits." },
    // Add more FAQ items here
  ];

  const filteredFaqItems = faqItems.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sections = {
    faq: (
      <>
        <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
        <input
          type="text"
          placeholder="Search FAQs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        {filteredFaqItems.map((item, index) => (
          <div key={index} className="mb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="cursor-pointer p-4 bg-gray-100 text-gray-800 rounded-lg shadow-sm"
                onClick={() => handleFaqToggle(index)}
              >
                <h3 className="text-lg font-medium">{item.question}</h3>
              </div>
              {faqOpen === index && (
                <animated.div style={fade} className="p-4 bg-gray-50 text-gray-800 rounded-lg shadow-md">
                  <p className="mt-2">{item.answer}</p>
                </animated.div>
              )}
            </motion.div>
          </div>
        ))}
      </>
    ),
    accountSetup: (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6">Account Setup</h2>
          <div className="p-4 bg-gray-50 text-gray-800 rounded-lg shadow-md">
            <p>To set up your account, click on the "Sign Up" button on the top right corner and fill in your details. You will receive a confirmation email to verify your account.</p>
          </div>
        </motion.div>
      </>
    ),
    orderTracking: (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6">Order Tracking</h2>
          <div className="p-4 bg-gray-50 text-gray-800 rounded-lg shadow-md">
            <p>To track your order, go to "My Orders" in your account dashboard. You will see the status of your current orders and the expected delivery time.</p>
          </div>
        </motion.div>
      </>
    ),
    returnsRefunds: (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6">Returns & Refunds</h2>
          <div className="p-4 bg-gray-50 text-gray-800 rounded-lg shadow-md">
            <p>If you need to return an item or request a refund, please contact our support team with your order details. We will guide you through the process.</p>
          </div>
        </motion.div>
      </>
    ),
    contactSupport: (
      <>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-3xl font-bold mb-6">Contact Support</h2>
          <section className="text-gray-600 body-font relative">
            <div className="absolute inset-0 bg-gray-300">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
                title="map"
                scrolling="no"
                src="https://maps.google.com/maps?width=100%&amp;height=600&amp;hl=en&amp;q=FEU%20Alabang&amp;ie=UTF8&amp;t=&amp;z=14&amp;iwloc=B&amp;output=embed"
                style={{ filter: 'grayscale(1) contrast(1.2) opacity(0.4)' }}
              ></iframe>
            </div>
            <div className="container px-5 py-24 mx-auto flex">
              <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-md">
                <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Feedback</h2>
                <p className="leading-relaxed mb-5 text-gray-600">We value your feedback. Please let us know your thoughts and suggestions.</p>
                <div className="relative mb-4">
                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
                <div className="relative mb-4">
                  <label htmlFor="message" className="leading-7 text-sm text-gray-600">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    className="w-full bg-white rounded border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
                <button className="text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg">Submit</button>
                <p className="text-xs text-gray-500 mt-3">Thank you for helping us improve our services.</p>
              </div>
            </div>
          </section>
        </motion.div>
      </>
    )
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white text-gray-800 p-6 flex justify-between items-center shadow-md">
        <h1 className="text-4xl font-bold ">Help Center</h1>
        <div>
          <p className="text-lg">Can't find your answer?</p>
          <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
            Contact Us
          </button>
        </div>
      </header>
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/4 bg-gray-100 text-gray-800 p-6 shadow-md">
          <nav>
            <ul className="space-y-4">
              <li
                className={`flex items-center cursor-pointer p-4 rounded-lg ${selectedSection === 'faq' ? 'bg-green-100' : 'hover:bg-green-50'}`}
                onClick={() => setSelectedSection('faq')}
              >
                <FaQuestionCircle className="mr-3" /> FAQs
              </li>
              <li
                className={`flex items-center cursor-pointer p-4 rounded-lg ${selectedSection === 'accountSetup' ? 'bg-green-100' : 'hover:bg-green-50'}`}
                onClick={() => setSelectedSection('accountSetup')}
              >
                <FaUserCircle className="mr-3" /> Account Setup
              </li>
              <li
                className={`flex items-center cursor-pointer p-4 rounded-lg ${selectedSection === 'orderTracking' ? 'bg-green-100' : 'hover:bg-green-50'}`}
                onClick={() => setSelectedSection('orderTracking')}
              >
                <FaShippingFast className="mr-3" /> Order Tracking
              </li>
              <li
                className={`flex items-center cursor-pointer p-4 rounded-lg ${selectedSection === 'returnsRefunds' ? 'bg-green-100' : 'hover:bg-green-50'}`}
                onClick={() => setSelectedSection('returnsRefunds')}
              >
                <FaUndo className="mr-3" /> Returns & Refunds
              </li>
              <li
                className={`flex items-center cursor-pointer p-4 rounded-lg ${selectedSection === 'contactSupport' ? 'bg-green-100' : 'hover:bg-green-50'}`}
                onClick={() => setSelectedSection('contactSupport')}
              >
                <FaEnvelope className="mr-3" /> Contact Support
              </li>
            </ul>
          </nav>
        </div>
        <div className="w-full md:w-3/4 p-8 bg-white text-gray-800">
          {sections[selectedSection]}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
