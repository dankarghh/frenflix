// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCusdY0gTBJJT9K9ads_7NfcMFdnzpKPrg",
  authDomain: "frenflix-7206a.firebaseapp.com",
  projectId: "frenflix-7206a",
  storageBucket: "frenflix-7206a.appspot.com",
  messagingSenderId: "767362886221",
  appId: "1:767362886221:web:13a9fde9687265b03eca04",
  measurementId: "G-NCXQEZ34ZL",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
