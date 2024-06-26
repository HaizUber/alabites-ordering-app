import React from 'react';

const Modal = ({ handleCloseModal }) => {
  if (!handleCloseModal) {
    console.error('Modal: handleCloseModal function is undefined');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Payment Successful</h2>
        <button
          onClick={handleCloseModal}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
