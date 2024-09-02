import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import debounce from 'lodash/debounce';

const TransactionHistory = ({ transactions = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOption, setFilterOption] = useState('recent'); // 'recent' or 'oldest'

  useEffect(() => {
    const groupTransactionsByDate = (transactions) => {
      const grouped = {};
      transactions.forEach((transaction) => {
        const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(transaction);
      });
      return grouped;
    };

    const filteredTransactions = transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedTransactions = filteredTransactions.sort((a, b) => {
      if (filterOption === 'recent') {
        return new Date(b.date) - new Date(a.date);
      } else if (filterOption === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      }
      return 0;
    });

    setGroupedTransactions(groupTransactionsByDate(sortedTransactions));
  }, [transactions, searchTerm, filterOption]);

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = Object.keys(groupedTransactions)
    .slice(indexOfFirstTransaction, indexOfLastTransaction)
    .reduce((acc, dateKey) => {
      acc[dateKey] = groupedTransactions[dateKey];
      return acc;
    }, {});

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(Object.keys(groupedTransactions).length / transactionsPerPage);

  const getTransactionClass = (transaction) => {
    if (transaction.type === 'card' || transaction.type === 'payatcounter' || (transaction.type === 'tamcredits' && transaction.description.toLowerCase().includes('purchase'))) {
      return 'text-red-500';
    } else if (transaction.type === 'tamcredits' && transaction.description.toLowerCase().includes('adding credits')) {
      return 'text-green-500';
    }
    return 'text-gray-500'; // Default color or handle additional types as needed
  };

  const getTransactionAmount = (transaction) => {
    const amount = Math.abs(transaction.amount);
    if (transaction.type === 'card' || transaction.type === 'payatcounter') {
      return `-PHP${amount}`;
    } else if (transaction.type === 'tamcredits' && transaction.description.toLowerCase().includes('purchase')) {
      return `-TC${amount}`;
    } else if (transaction.type === 'tamcredits' && transaction.description.toLowerCase().includes('adding credits')) {
      return `+TC${amount}`;
    }
    return `TC${amount}`; // Default currency if other conditions do not match
  };

  const handleSearchChange = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 300);

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Transaction History</h3>
      <div className="mb-4">
        <input
          type="text"
          onChange={handleSearchChange}
          placeholder="Search by product"
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
        />
      </div>
      <div className="mb-4">
        <select
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out"
        >
          <option value="recent">Recent to Oldest</option>
          <option value="oldest">Oldest to Recent</option>
        </select>
      </div>
      <div className="mt-4">
        <ul className="flex justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <li key={number}>
              <button
                onClick={() => paginate(number)}
                className={`px-3 py-1 mx-1 rounded-md focus:outline-none ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out'}`}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {Object.keys(currentTransactions).length === 0 ? (
        <p className="text-gray-600">No transactions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.keys(currentTransactions).map((dateKey) => (
            <div key={dateKey} className="text-center">
              <p className="font-semibold">{format(new Date(dateKey), 'dd MMM')}</p>
              {currentTransactions[dateKey].map((transaction, index) => (
                <div
                  key={index}
                  className={`bg-gray-200 p-4 rounded-lg mb-4 flex justify-between items-center transition duration-300 ease-in-out hover:shadow-md`}
                >
                  <span className="mr-2">{transaction.description}</span>
                  <span className={getTransactionClass(transaction)}>
                    {getTransactionAmount(transaction)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
