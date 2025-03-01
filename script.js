// Import Firebase modules
import { db, auth, analytics } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

// ==================== Login Form Submission ====================
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
                loginLoading.classList.remove("show");
                logEvent(analytics, 'login', { method: 'email/password' });
                window.location.href = "exam.html";
            })
            .catch((error) => {
                console.error("Login failed:", error.code, error.message);
                loginLoading.classList.remove("show");
                loginError.textContent = "Login failed: " + error.message;
            });
    });
}

// ==================== Timer (Set for 25 minutes) ====================
if (document.getElementById("timer")) {
    let timeLeft = 1500; // 25 minutes in seconds
    const timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("time").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitExam();
        }
    }, 1000);
}

// ==================== Submit Exam Function ====================
const examForm = document.getElementById("exam-form");
if (examForm) {
    examForm.addEventListener("submit", function (e) {
        e.preventDefault();
        submitExam();
    });
}

// Define the correct answers
const correctAnswers = {
    q1: "A", q2: "C", q3: "B", q4: "A", q5: "B"
};

function calculateMarks() {
    let totalMarks = 0;
    const answers = document.querySelectorAll('input[type="radio"]:checked');
    const studentAnswers = {};

    // Collect student's answers
    answers.forEach((answer) => {
        studentAnswers[answer.name] = answer.value;
    });

    // Compare student's answers with correct answers
    for (const question in correctAnswers) {
        if (studentAnswers[question] === correctAnswers[question]) {
            totalMarks++;
        }
    }

    return totalMarks;
}

function submitExam() {
    const user = auth.currentUser;
    if (!user) {
        alert("Please log in first!");
        return;
    }

    const marks = calculateMarks();
    const marksDisplay = document.getElementById("marks-display");

    // Ensure marks is a valid number
    if (typeof marks !== 'number' || isNaN(marks)) {
        console.error("Invalid marks value:", marks);
        alert("Error calculating marks. Please try again.");
        return;
    }

    // Save marks to Firestore
    setDoc(doc(db, "students", user.uid), { marks })
        .then(() => {
            console.log("Marks saved to Firestore:", marks);
            logEvent(analytics, 'exam_submitted', { marks: marks });

            // Display marks to the student
            if (marksDisplay) {
                marksDisplay.textContent = `আপনার নম্বর: ${marks}/5`;
            }

            // Hide the exam form
            if (examForm) {
                examForm.style.display = "none";
            }
        })
        .catch((error) => {
            console.error("Error submitting exam:", error);
            alert("Error submitting exam: " + error.message);
        });
}

// ==================== Admin: Fetch Marks ====================
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
                const marks = doc.data().marks;

                // Ensure marks is a valid number
                if (typeof marks === 'number' && !isNaN(marks)) {
                    row.innerHTML = `<td>${doc.id}</td><td>${marks}</td>`;
                } else {
                    row.innerHTML = `<td>${doc.id}</td><td>Invalid Marks</td>`;
                }
                marksTable.appendChild(row);
            });
        })
        .catch((error) => {
            console.error("Error fetching marks:", error);
        });
}
