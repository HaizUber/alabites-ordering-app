import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CartModal from './CartModal';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const Header = ({ cartItems, setCartItems }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [tamCredits, setTamCredits] = useState(0);
  const [showCartModal, setShowCartModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const storedCartItems = localStorage.getItem('cartItems');
    if (storedCartItems) {
      setCartItems(JSON.parse(storedCartItems));
    }
  }, [setCartItems]);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setIsLoading(true);
        try {
          const response = await axios.get('https://alabites-api.vercel.app/users');
          const userData = response.data.data.find((userData) => userData.email === user.email);
          if (userData) {
            setUsername(userData.username);
            setUserAvatar(userData.useravatar);
            setTamCredits(userData.currencyBalance);
          } else {
            setUsername('User');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername('');
          if (error.response && error.response.status === 404) {
            setUsername('Student');
          } else {
            toast.error('Error fetching user data');
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoggedIn(false);
        setUsername('User');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      toast.success('Logout successful');
    }).catch((error) => {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
    });
  };

  const toggleCartModal = useCallback(() => {
    setShowCartModal((prev) => !prev);
  }, []);

  const removeItemFromCart = useCallback((index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
  }, [cartItems, setCartItems]);

  const updateCartItemQuantity = useCallback((index, newQuantity) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems[index].quantity = newQuantity;
    setCartItems(updatedCartItems);
  }, [cartItems, setCartItems]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navItems = useMemo(() => (
    ['Home', 'About', 'Contact', 'Help Center', 'Profile'].map((item) => (
      <li key={item}>
        <Link className="text-gray-500 transition hover:text-gray-700" to={`/${item.toLowerCase().replace(' ', '-')}`}>
          {item}
        </Link>
      </li>
    ))
  ), []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, username }}>
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={toggleMobileMenu} className="block md:hidden rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <Link className="block text-green-800" to="/">
                <span className="sr-only">Home</span>
                <img className="h-12" src="/assets/logo.png" alt="Logo" />
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  {navItems}
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <button onClick={toggleCartModal} className="relative rounded-md bg-blue-500 px-5 py-2.5 text-sm font-medium text-white shadow transition-transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart" viewBox="0 0 16 16">
  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg>
                  {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItems.length}
                    </span>
                  )}
                </button>
              </div>

              {!isLoggedIn ? (
                <div className="flex gap-2">
                  <Link to="/login/student" className="rounded-md bg-green-800 px-3 py-2 text-sm font-medium text-white shadow transition-transform hover:scale-105">Login</Link>
                  <Link to="/register/student" className="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-teal-600 transition-transform hover:scale-105">Register</Link>
                </div>
              ) : (
                <div className="relative flex items-center gap-4">
                  {isLoading ? (
                    <span className="text-gray-600 text-sm">Loading...</span>
                  ) : (
                    <>
                     
                        <div className="flex items-center gap-2 p-2 bg-gray-200 rounded-full">
                          <span className="text-gray-700 text-sm flex items-center gap-1">
                            <img className="h-5 w-8" src="/assets/tamcredits.png" alt="Tam Credits" />
                            {tamCredits}
                          </span>
                          <Link to="/topup" className="text-blue-500 hover:text-blue-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-full">
                        <img className="rounded-full h-8 w-8 cursor-pointer" src={userAvatar} alt={`${username}'s avatar`} onClick={toggleDropdown} />
                      </div>
                      {isDropdownOpen && (
                        <div className="absolute right-0 top-2 mt-12 w-48 bg-white rounded-md shadow-lg py-2 z-50">
                          <div className="flex items-center gap-4 px-4 py-2">
                            <img className="rounded-full h-8 w-8" src={userAvatar} alt={`${username}'s avatar`} />
                            <span className="text-gray-700 text-sm">{username}</span>
                          </div>
                          <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                          <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden">
            <nav aria-label="Global" className="bg-white shadow-md mt-2">
              <ul className="flex flex-col items-center gap-6 text-sm py-4">
                {navItems}
              </ul>
            </nav>
          </div>
        )}

        <ToastContainer />
      </header>

      {showCartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
          <CartModal
            cartItems={cartItems}
            removeItemFromCart={removeItemFromCart}
            updateCartItemQuantity={updateCartItemQuantity}
            onClose={toggleCartModal}
            setCartItems={setCartItems}
          />
        </div>
      )}
    </AuthContext.Provider>
  );
};

export default Header;
