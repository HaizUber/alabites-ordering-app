import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Header from './components/header'; // Corrected import path
import AdminPage from './components/admin/adminpage'; // Corrected import path
import AddProductForm from './components/admin/addproductform'; // Corrected import path
import StudentLoginPage from './pages/StudentLoginPage'; // Import the StudentLoginPage component
import StudentRegisterPage from './pages/StudentRegisterPage'; // Import the StudentRegisterPage component

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          {/* Add routes for login pages */}
          <Route path="/login/student" element={<StudentLoginPage />} />
          {/* Add routes for register pages */}
          <Route path="/register/student" element={<StudentRegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
