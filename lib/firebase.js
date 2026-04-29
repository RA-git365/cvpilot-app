import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeoy01xhHMxSgK0YdCcI6wZ-3CYM6VsWc",
  authDomain: "cvpilot-8a36c.firebaseapp.com",
  projectId: "cvpilot-8a36c",
  storageBucket: "cvpilot-8a36c.firebasestorage.app",
  messagingSenderId: "26400131236",
  appId: "1:26400131236:web:22fa7f2f0f8d8a6f1d3e31",
  measurementId: "G-8G6P4T90M9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);