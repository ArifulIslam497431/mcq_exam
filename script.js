// Import Firebase modules
import { db, auth, analytics } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { logEvent } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-analytics.js";

console.log("Firebase modules imported successfully.");

// ==================== Timer (Set for 25 minutes) ====================
if (document.getElementById("timer")) {
    console.log("Timer initialized.");
    let timeLeft = 1500; // 25 minutes in seconds
    const timer = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("time").textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            console.log("Time's up! Submitting exam...");
            submitExam();
        }
    }, 1000);
}

// ==================== Submit Exam Function ====================
const examForm = document.getElementById("exam-form");
if (examForm) {
    console.log("Exam form found.");
    examForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Exam form submitted.");
        submitExam();
    });
}

// Define the correct answers
const correctAnswers = {
    q1: "A", q2: "C", q3: "B", q4: "A", q5: "B"
};

function calculateMarks() {
    console.log("Calculating marks...");
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

    console.log("Total Marks:", totalMarks);
    return totalMarks;
}

function submitExam() {
    console.log("Submitting exam...");
    const user = auth.currentUser;
    if (!user) {
        console.error("User not logged in.");
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
