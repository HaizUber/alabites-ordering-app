// pages/StudentLoginPage.js

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in the student using Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to student dashboard or other page upon successful login
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div>
      <h1>Student Login Page</h1>
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
          value={studentNumber}
          onChange={(e) => setStudentNumber(e.target.value)}
          placeholder="Student Number"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default StudentLoginPage;
