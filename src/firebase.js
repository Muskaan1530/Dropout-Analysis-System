// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAVaBrIiO663gLnjVojfYRALBUf1DMNGTE",
  authDomain: "ai-dropout-prediction-system.firebaseapp.com",
  projectId: "ai-dropout-prediction-system",
  storageBucket: "ai-dropout-prediction-system.firebasestorage.app",
  messagingSenderId: "340277806318",
  appId: "1:340277806318:web:af56425309f82886dadfff",
  measurementId: "G-JC3LHSKDTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);
