// firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "real-estate-5d18a.firebaseapp.com",
  projectId: "real-estate-5d18a",
  storageBucket: "real-estate-5d18a.appspot.com",  // ✅ FIXED
  messagingSenderId: "65563435221",
  appId: "1:65563435221:web:b3da099b5758e4d681425c",
  measurementId: "G-4V2FMCQY87"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
