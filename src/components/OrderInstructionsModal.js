// src/components/OrderInstructionsModal.js

import React from 'react';
import { Dialog } from '@headlessui/react'; // Assuming you're using Headless UI for the modal

const OrderInstructionsModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center">
        <Dialog.Panel className="mx-auto max-w-lg rounded bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-bold">Ordering Instructions</Dialog.Title>
          <Dialog.Description className="mt-2">
          <p>Follow these steps to place your order:</p>
<ol className="list-decimal pl-5">
  <li>Select your desired items from the menu.</li>
  <li>Add them to your cart.</li>
  <li>Proceed to checkout.</li>
  <li>Select a payment method (TamCredits, PayMongo, Pay at Counter).</li>
  <li>Complete your payment and present your order ID to the store owner to claim your food. The order ID can be found on your profile page under "Pending Orders."</li>
</ol>
<p className="mt-2 text-sm text-gray-600">
  Note: If you wish to pay with GCash, please pay the indicated GCash number for each menu item beforehand and select the "Pay at Counter" payment option. Present your proof of payment to the store owner upon claiming your order.
</p>


          </Dialog.Description>
          <button onClick={onClose} className="mt-4 rounded bg-green-800 px-4 py-2 text-white">
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default OrderInstructionsModal;
