import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN || "real-estate-5d18a.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID || "real-estate-5d18a",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET || "real-estate-5d18a.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID || "65563435221",
  appId: import.meta.env.VITE_FIREBASE_APPID || "1:65563435221:web:b3da099b5758e4d681425c",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID || "G-4V2FMCQY87"
};

export const app = initializeApp(firebaseConfig);