import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/header.css';

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const response = await axios.get(`https://alabites-api.vercel.app/users`);
          const userData = response.data.data.find((userData) => userData.email === user.email);
          if (userData) {
            const uid = userData.uid;
            console.log('uid:', uid); // Log the uid
            setUsername(userData.username);
          } else {
            setUsername('');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUsername('');
          // Check if the error is due to the user not being found
          if (error.response && error.response.status === 404) {
            // User not found, ignore the error
            setUsername('Student');
          } else {
            // Other errors, display toast
            toast.error('Error fetching user data');
          }
        }
      } else {
        setIsLoggedIn(false);
        setUsername('');
      }
    });
    
    return () => unsubscribe();
  }, [isLoggedIn]);
  
  const handleLogout = () => {
    console.log("Logging out...");
    const auth = getAuth();
    auth.signOut().then(() => {
      toast.success('Logout successful');
    }).catch((error) => {
      console.error('Logout error:', error);
      toast.error('Error logging out. Please try again.');
    });
  };
  

  return (
    <AuthContext.Provider value={{ isLoggedIn, username }}>
      <header className="bg-white">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link className="block text-green-800" to="/">
                <span className="sr-only">Home</span>
                <img className="h-12" src="/assets/logo.png" alt="Logo" />
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <Link className="text-gray-500 transition hover:text-gray-500/75" to="/">Home</Link>
                  </li>
                  <li>
                    <Link className="text-gray-500 transition hover:text-gray-500/75" to="/about">About</Link>
                  </li>
                  <li>
                    <Link className="text-gray-500 transition hover:text-gray-500/75" to="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link className="text-gray-500 transition hover:text-gray-500/75" to="/help">Help</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
  {!isLoggedIn && (
    <div className="sm:flex sm:gap-4">
      <Link to="/login/student" className="rounded-md bg-green-800 px-5 py-2.5 text-sm font-medium text-white shadow">Login</Link>
      <Link to="/register/student" className="hidden sm:block rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-teal-600">Register</Link>
    </div>
  )}

  {isLoggedIn && username && (
    <div className="flex items-center gap-4">
      <span className="text-gray-600 text-sm">Welcome, {username}</span>
      <button onClick={handleLogout} className="rounded-md bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow">Logout</button>
    </div>
  )}

  <div className="block md:hidden">
    <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</div>

          </div>
        </div>
        <ToastContainer/> 
      </header>
    </AuthContext.Provider>
    
  );
};

export default Header;
