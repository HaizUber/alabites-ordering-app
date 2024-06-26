// LoadingModal.js
import React from 'react';
import '../styles/CheckoutModal.css'; // Import the CSS file

const LoadingModal = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="loading-modal">
      <div className="loading-modal-content">
        <div className="loading-icon"></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;
