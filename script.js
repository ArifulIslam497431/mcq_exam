// Import Firebase modules
import { auth, db } from "./firebase-config.js";
import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// **Login Function**
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const email = document.getElementById("student-id").value;  // Use actual email
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login successful!");
            window.location.href = "exam.html"; // Redirect to exam page
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});

// **Timer (Set for 25 minutes)**
let timeLeft = 1500; // 25 minutes in seconds
const timerElement = document.getElementById("timer");

if (timerElement) {
    const timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = `সময় বাকি: ${Math.floor(timeLeft / 60)} মিনিট ${timeLeft % 60} সেকেন্ড`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitExam();
        }
    }, 1000);
}

// **Submit Exam Function**
document.getElementById("exam-form").addEventListener("submit", function (e) {
    e.preventDefault();
    submitExam();
});

function submitExam() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first!");
        return;
    }

    const marks = calculateMarks(); // Implement this function
    setDoc(doc(db, "students", user.uid), { marks })
        .then(() => {
            alert("Exam submitted!");
            window.location.href = "index.html";
        })
        .catch((error) => {
            alert("Error submitting exam: " + error.message);
        });
}

// **Admin: Fetch Marks**
const marksTable = document.getElementById("marks-table");
if (marksTable) {
    getDocs(collection(db, "students"))
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${doc.id}</td><td>${doc.data().marks}</td>`;
                marksTable.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching marks: ", error);
        });
}
