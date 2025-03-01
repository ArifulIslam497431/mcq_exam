import { db, auth } from "./firebase-config.js";  
console.log(db, auth); // Debug: Ensure Firebase is properly imported

import { signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// **Login Function**
document.getElementById("login-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const email = document.getElementById("student-id").value;  
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            alert("Login successful!");
            window.location.href = "exam.html";
        })
        .catch((error) => {
            alert("Login failed: " + error.message);
        });
});

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
document.getElementById("exam-form")?.addEventListener("submit", function (e) {
    e.preventDefault();
    submitExam();
});

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
