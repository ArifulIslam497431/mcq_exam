// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHzvXJJP10P1ofwXgXwg7Sg2xTODXce1g", // Replace with your actual API key
  authDomain: "mcq-exam-ea9e2.firebaseapp.com", // Replace with your actual auth domain
  projectId: "mcq-exam-ea9e2", // Replace with your actual project ID
  storageBucket: "mcq-exam-ea9e2.firebasestorage.app", // Replace with your actual storage bucket
  messagingSenderId: "468489593575", // Replace with your actual messaging sender ID
  appId: "1:468489593575:web:d3a02e49642baef8e0f842", // Replace with your actual app ID
  measurementId: "G-Q7WV02X775" // Replace with your actual measurement ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Analytics
const analytics = getAnalytics(app);

// Check if Firebase is initialized correctly
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Firebase initialized successfully. User is signed in.");
  } else {
    console.log("Firebase initialized successfully. No user is signed in.");
  }
}, (error) => {
  console.error("Firebase initialization error:", error);
});

export { auth, db, analytics };
