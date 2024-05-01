// pages/AdminLoginPage.js

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [concessionName, setConcessionName] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in the admin using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to admin dashboard or other page upon successful login
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div>
      <h1>Admin Login Page</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <input
          type="text"
          value={concessionName}
          onChange={(e) => setConcessionName(e.target.value)}
          placeholder="Food Concession Name"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLoginPage;
