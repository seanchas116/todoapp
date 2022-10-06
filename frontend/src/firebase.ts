import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA9qrJgQU7-iQw_aUJ-Xk9xvLtjfl8fDmo",
  authDomain: "todoapp-442c3.firebaseapp.com",
  projectId: "todoapp-442c3",
  storageBucket: "todoapp-442c3.appspot.com",
  messagingSenderId: "231766760058",
  appId: "1:231766760058:web:2bd9ef3b35dfec75e3b9c3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
