// Login
document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const studentId = document.getElementById('student-id').value;
    const password = document.getElementById('password').value;

    // Firebase login
    auth.signInWithEmailAndPassword(studentId + '@example.com', password)
        .then(() => {
            alert('Login successful!');
            window.location.href = 'exam.html'; // Redirect to exam page
        })
        .catch((error) => {
            alert('Login failed: ' + error.message); // Show error message
        });
});

// Timer
let timeLeft = 1800; // 30 minutes
const timer = setInterval(() => {
    timeLeft--;
    document.getElementById('timer').innerText = `Time Left: ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`;
    if (timeLeft <= 0) {
        clearInterval(timer);
        submitExam();
    }
}, 1000);

// Submit Exam
document.getElementById('exam-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitExam();
});

function submitExam() {
    const student = auth.currentUser;
    const marks = calculateMarks(); // Add logic to calculate marks
    db.collection('students').doc(student.uid).set({ marks })
        .then(() => {
            alert('Exam submitted!');
            window.location.href = 'index.html';
        });
}

// Admin: Fetch Marks
db.collection('students').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${doc.id}</td><td>${doc.data().marks}</td>`;
        document.getElementById('marks-table').appendChild(row);
    });
});
