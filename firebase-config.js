
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBHzvXJJP10P1ofwXgXwg7Sg2xTODXce1g",
  authDomain: "mcq-exam-ea9e2.firebaseapp.com",
  projectId: "mcq-exam-ea9e2",
  storageBucket: "mcq-exam-ea9e2.firebasestorage.app",
  messagingSenderId: "468489593575",
  appId: "1:468489593575:web:d3a02e49642baef8e0f842",
  measurementId: "G-Q7WV02X775"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Export Firestore and Auth
export { db, auth };
