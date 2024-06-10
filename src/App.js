import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/header'; // Corrected import path
import StudentLoginPage from './pages/StudentLoginPage'; // Import the StudentLoginPage component
import StudentRegisterPage from './pages/StudentRegisterPage'; // Import the StudentRegisterPage component
import CheckoutPage from './components/checkout';


const App = () => {
  // Retrieve cart items from local storage or initialize as an empty array
  const [cartItems, setCartItems] = useState(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    return storedCartItems ? JSON.parse(storedCartItems) : [];
  });

  // Save cart items to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to remove an item from the cart
  const removeItemFromCart = (index) => {
    // Create a copy of the current cart items array
    const updatedCartItems = [...cartItems];
    // Remove the item at the specified index
    updatedCartItems.splice(index, 1);
    // Update the state with the modified array
    setCartItems(updatedCartItems);
  };

  const updateCartItemQuantity = (index, newQuantity) => {
    // Create a copy of the current cart items array
    const updatedCartItems = [...cartItems];
    // Update the quantity of the item at the specified index
    updatedCartItems[index].quantity = newQuantity;
    // Update the state with the modified array
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div>
      <Header cartItems={cartItems} setCartItems={setCartItems} removeItemFromCart={removeItemFromCart} />
        <Routes>
          <Route
            path="/"
            element={<LandingPage cartItems={cartItems} setCartItems={setCartItems} removeItemFromCart={removeItemFromCart} />} // Pass removeItemFromCart as a prop
          />
          <Route path="/login/student" element={<StudentLoginPage />} />
          {/* Add routes for register pages */}
          <Route path="/register/student" element={<StudentRegisterPage />} />
          <Route
            path="/checkout"
            element={<CheckoutPage clearCart={clearCart}/>} // Pass clearCart and navigate as props
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
