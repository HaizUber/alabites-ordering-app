// pages/AdminRegisterPage.js

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

function AdminRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [concessionName, setConcessionName] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Create a new admin account using Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect to admin dashboard or other page upon successful registration
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  return (
    <div>
      <h1>Admin Register Page</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default AdminRegisterPage;
