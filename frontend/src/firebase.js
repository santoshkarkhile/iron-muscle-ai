import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// ⚠️ REPLACE THIS BLOCK WITH YOUR ACTUAL KEYS FROM FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyAhvfqXycnVKtQAm0q_r0dyyNcknimH2Qg",
  authDomain: "iron-muscle-ai.firebaseapp.com",
  projectId: "iron-muscle-ai",
  storageBucket: "iron-muscle-ai.firebasestorage.app",
  messagingSenderId: "823955930001",
  appId: "1:823955930001:web:52d22b41ac01747cd1b830",
  measurementId: "G-NV597LFL26"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Export these so we can use them in your React components!
export { auth, provider, signInWithPopup, signOut };