import React from 'react';
import LandingPage from './components/LandingPage';
import Header from './components/header'; 

const App = () => {
  return (
    <div>
      <Header /> {/* Include the Header component */}
      <LandingPage />
      
    </div>
  );
};

export default App;
