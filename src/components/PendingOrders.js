import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PendingOrders = ({ pendingOrders = [], loading, searchTerm, filterOption, onRefresh, setSearchTerm, setFilterOption }) => {
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    // Filter and sort orders based on searchTerm and filterOption
    let filtered = [...pendingOrders]; // Create a copy to avoid mutating the original array

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply sort filter
    if (filterOption === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterOption === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredOrders(filtered);
    // Reset animation state when orders change
    setAnimationCompleted(false);
  }, [pendingOrders, searchTerm, filterOption]);

  useEffect(() => {
    // Set animation state to true after a short delay to trigger animations
    const timeout = setTimeout(() => {
      setAnimationCompleted(true);
    }, 100);

    return () => clearTimeout(timeout);
  }, [filteredOrders]);

  const notifyRefresh = () => toast.info('Orders refreshed!', {
    position: 'bottom-right'
  });

  const calculateTotalPrice = (items) => {
    const totalPrice = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    return totalPrice.toFixed(2);
  };

  return (
    <div className="mt-8 bg-white shadow-lg rounded-lg p-6 md:w-2/3 lg:w-1/2 w-full fade-in animate-fadeIn">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Pending Orders</h2>
        <button onClick={() => { onRefresh(); notifyRefresh(); }} className="text-blue-500 hover:underline">Refresh</button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by item name..."
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="ml-2 bg-gray-200 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-300 focus:outline-none"
          >
            Clear
          </button>
        )}
      </div>
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="recent">Most Recent</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
      {loading ? (
        <Skeleton count={5} height={50} />
      ) : filteredOrders.length > 0 ? (
        <div className="overflow-y-auto max-h-96">
          <ul className="space-y-4">
            {filteredOrders.map((order, index) => (
              <li
                key={order._id}
                className={`border border-gray-200 rounded-lg p-4 transition duration-300 ease-in-out hover:shadow-md ${animationCompleted ? 'fade-in-up' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Order Number: {order.orderNumber}</p>
                    <p>Customer: {order.customer.name} ({order.customer.email})</p>
                    <p>Payment Method: {order.paymentDetails.method}</p>
                    <p>Transaction ID: {order.paymentDetails.transactionId}</p>
                  </div>
                  <div>
                    <p className={`text-${order.orderStatus === 'Pending' ? 'yellow' : 'green'}-500 font-semibold`}>{order.orderStatus}</p>
                    <p>Created At: {new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700">Items:</p>
                  <ul className="list-disc ml-4">
                    {order.items.map((item) => (
                      <li key={item._id}>
                        {item.name} - Quantity: {item.quantity} - Price: PHP {item.price}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="text-gray-700 font-semibold">Total: PHP {calculateTotalPrice(order.items)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-600">No pending orders found.</p>
      )}

      <ToastContainer />
    </div>
  );
};

export default PendingOrders;
