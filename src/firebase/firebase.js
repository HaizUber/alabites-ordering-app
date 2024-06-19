// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKZMOtp6UyChH93J9FMduAVa1ag4a0A8g",
  authDomain: "alabites-app-base.firebaseapp.com",
  projectId: "alabites-app-base",
  storageBucket: "alabites-app-base.appspot.com",
  messagingSenderId: "162563822794",
  appId: "1:162563822794:web:9a0481203a123640625033",
  measurementId: "G-RRNSDMNNC3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }; // Exporting auth here