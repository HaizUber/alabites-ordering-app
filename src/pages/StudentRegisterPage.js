// pages/StudentRegisterPage.js

import React, { useState } from "react";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentRegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [studentNumber, setStudentNumber] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        // Register user with Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Send additional user data to backend for MongoDB storage
        await axios.post("https://alabites-api.vercel.app/users", {
            uid: user.uid, // Firebase user ID
            email,
            username,
            studentNumber
        });
        // Show success toast
      toast.success("Registration successful!");

        // Redirect to student dashboard or other page upon successful registration
    } catch (error) {
        if (error.code === "auth/email-already-in-use") {
            console.error("Error registering:", error.message);
            alert("Email address is already in use. Please use a different email address.");
        } else {
            console.error("Error registering:", error);
            alert("An error occurred during registration. Please try again later.");
        }
    }
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Student Register Page</h1>
      <form onSubmit={handleRegister} className="w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700">
            Student Number
          </label>
          <input
            type="text"
            id="studentNumber"
            className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        >
          Register
        </button>
        <ToastContainer />
      </form>
    </div>
  );
}

export default StudentRegisterPage;

