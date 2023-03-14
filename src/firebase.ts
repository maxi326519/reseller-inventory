// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { writeBatch } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEVS8BzoHswHgMCCL3KEtJRVkTfswRS9c",
  authDomain: "reseller-8e187.firebaseapp.com",
  projectId: "reseller-8e187",
  storageBucket: "reseller-8e187.appspot.com",
  messagingSenderId: "666877148923",
  appId: "1:666877148923:web:40b36f697f017b7f443a5e",
};

// Initialize Firebase
export const fs = initializeApp(firebaseConfig);

// Initilize FireStore Services
export const db = getFirestore(fs);
export const auth = getAuth(fs);
export const storage = getStorage(fs);
export const batch = writeBatch(db);
