
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
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();