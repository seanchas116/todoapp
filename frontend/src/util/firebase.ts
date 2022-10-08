import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlPxL3wOIh9_ICiirm00m58et-P5R0Mug",
  authDomain: "todoapp-8baeb.firebaseapp.com",
  projectId: "todoapp-8baeb",
  storageBucket: "todoapp-8baeb.appspot.com",
  messagingSenderId: "859744497518",
  appId: "1:859744497518:web:07851f0e649a8780865b7f",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
