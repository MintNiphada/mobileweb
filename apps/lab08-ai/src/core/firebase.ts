import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_A6f4LIw3Uc5jyOxOxU7bdknm-nJSD5Y",
  authDomain: "web2025-mobilewebapp.firebaseapp.com",
  projectId: "web2025-mobilewebapp",
  storageBucket: "web2025-mobilewebapp.firebasestorage.app",
  messagingSenderId: "702141441945",
  appId: "1:702141441945:web:5275319138767af2045508",
  measurementId: "G-7TW3VETC0T"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

