// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAq7-U3_205NuGEOLVZa0oLD8IGx2rC_HY",
  authDomain: "laptop-store-40c8a.firebaseapp.com",
  projectId: "laptop-store-40c8a",
  storageBucket: "laptop-store-40c8a.appspot.com",
  messagingSenderId: "630703989669",
  appId: "1:630703989669:web:91882b142e1987b9a4be4c",
  measurementId: "G-VC474J5DHY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { app, auth, db, analytics, storage };
