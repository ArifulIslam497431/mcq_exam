// script.js
import { db, auth, analytics } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// Login Form Submission
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const loginLoading = document.getElementById("login-loading");

if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("student-id").value;
        const password = document.getElementById("password").value;

        loginError.textContent = ""; // Clear previous errors
        loginLoading.classList.add("show"); // Show loading indicator

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log("Login successful", userCredential);
                loginLoading.classList.remove("show"); // Hide loading indicator
                logEvent(analytics, 'login', { method: 'email/password' });
                window.location.href = "exam.html";
            })
            .catch((error) => {
                console.error("Login failed:", error.code, error.message);
                loginLoading.classList.remove("show"); // Hide loading indicator
                loginError.textContent = "Login failed: " + error.message;
            });
    });
}

// **Timer (Set for 25 minutes)**
if (document.getElementById("timer")) {
    let timeLeft = 1500;
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `সময় বাকি: ${Math.floor(timeLeft / 60)} মিনিট ${timeLeft % 60} সেকেন্ড`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitExam();
        }
    }, 1000);
}

// **Submit Exam Function**
const examForm = document.getElementById("exam-form");
if (examForm) {
    examForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitExam();
    });
}

function calculateMarks() {
    let totalMarks = 0;
    const answers = document.querySelectorAll('input[type="radio"]:checked');

    answers.forEach((answer) => {
        totalMarks += parseInt(answer.value);
    });

    return totalMarks;
}

function submitExam() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first!");
        return;
    }

    const marks = calculateMarks();
    const marksDisplay = document.getElementById("marks-display"); // Get the marks display element
    setDoc(doc(db, "students", user.uid), { marks })
        .then(() => {
            logEvent(analytics, 'exam_submitted', { marks: marks });
            // Display marks to the student
            if (marksDisplay) {
                marksDisplay.textContent = `Your Marks: ${marks}`;
            }
            // Hide the exam form
            if (examForm) {
                examForm.style.display = "none";
            }
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
            if (querySnapshot.empty) {
                marksTable.innerHTML = "<tr><td colspan='2'>No data available</td></tr>";
                return;
            }

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
