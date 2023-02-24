// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7nrIyKS4VQLew6pM1O2jP37zjhtuH6EY",
  authDomain: "gesto-e26ab.firebaseapp.com",
  databaseURL: "https://gesto-e26ab-default-rtdb.firebaseio.com",
  projectId: "gesto-e26ab",
  storageBucket: "gesto-e26ab.appspot.com",
  messagingSenderId: "340558224805",
  appId: "1:340558224805:web:f8bb36140eed40b2c71c4c"
};

// Initialize Firebase
const fs = initializeApp(firebaseConfig);

// Initilize FireStore Database
export const db = getFirestore(fs);