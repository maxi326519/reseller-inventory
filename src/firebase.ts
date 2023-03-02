// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, writeBatch } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCscoOUwVRBYoZyHSUm45PeDKp_4gRedp8",
  authDomain: "prueba-db24f.firebaseapp.com",
  databaseURL: "https://prueba-db24f-default-rtdb.firebaseio.com",
  projectId: "prueba-db24f",
  storageBucket: "prueba-db24f.appspot.com",
  messagingSenderId: "519164590847",
  appId: "1:519164590847:web:e1daafbdf4b209ee482aca",
  measurementId: "G-0V2ZFKH2RS"
};

// Initialize Firebase
export const fs = initializeApp(firebaseConfig);

// Initilize FireStore Database
export const db = getFirestore(fs);

// Initialize FireStore batch
export const batch = writeBatch(db);