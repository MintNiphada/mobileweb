// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfiWyhVKLthXzS4JKe3n8arDU-VbXiH2g",
  authDomain: "web2025-mobilewebapp.firebaseapp.com",
  projectId: "web2025-mobilewebapp",
  storageBucket: "web2025-mobilewebapp.firebasestorage.app",
  messagingSenderId: "702141441945",
  appId: "1:702141441945:web:f75fa9a2169119d5045508",
  measurementId: "G-7Y85XDCRE6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
