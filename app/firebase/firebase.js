// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfbiFhsDiTbHVzMRUfQFBG5jj-BHNFlA8",
  authDomain: "travelagency-a568e.firebaseapp.com",
  projectId: "travelagency-a568e",
  storageBucket: "travelagency-a568e.appspot.com",
  messagingSenderId: "156145917406",
  appId: "1:156145917406:web:4d209b91edb57d57fed14f",
  measurementId: "G-4VHL3SN48Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage, googleProvider, onAuthStateChanged };
