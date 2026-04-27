let quizData = null;
let currentIndex = 0;
let correctAnswersCount = 0;
let startTime;
let timerInterval;
async function loadQuizData() {
    try {
        const response = await fetch('../json/preguntes.json');
        if (!response.ok) throw new Error("No se pudo cargar el JSON");
        quizData = await response.json();
        console.log("Datos cargados correctamente");
    } catch (error) {
        console.error("Error crítico:", error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadQuizData();
    const finalTime = localStorage.getItem('totalTime') || "0:00";
    const timeDisplay = document.getElementById('time');
    const scoreElement = document.getElementById('score');
    const totalElement = document.getElementById('total');
    const playerElement = document.getElementById('player');
    const restartButton = document.querySelector('button[onclick=""], .restart-btn');
    const btnComencar = document.getElementById('btn-comencar');
    const modal = document.getElementById('modal');
    const btnContinuar = document.getElementById('btn-continuar');
    const nameInput = document.getElementById('nameInput');
    if (btnComencar && modal) {
        btnComencar.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }
    if (btnContinuar && nameInput) {
        btnContinuar.addEventListener('click', () => {
            const nombre = nameInput.value.trim();

            if (nombre !== "") {
                localStorage.setItem('playerName', nombre);
                window.location.href = 'questions.html';
            } else {
                alert("Si us plau, introdueix un nom de jugador.");
            }
        });
    }
    if (timeDisplay) timeDisplay.textContent = finalTime;

    if (scoreElement && totalElement) {
        const finalScore = localStorage.getItem('lastScore') || 0;
        const totalQuestions = localStorage.getItem('totalQuestions') || 0;
        const playerName = localStorage.getItem('playerName') || "Adrian";

        scoreElement.textContent = `${finalScore}/${totalQuestions}`;
        totalElement.textContent = totalQuestions;
        if (playerElement) playerElement.textContent = playerName;
    }

    if (restartButton) {
        restartButton.addEventListener('click', () => {
            localStorage.removeItem('lastScore');
            localStorage.removeItem('totalQuestions');
            window.location.href = 'index.html';
        });
    }

    const toggleButton = document.getElementById('dark-mode-toggle');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    }
});

function startQuiz(categoryId) {
    if (!quizData) {
        console.error("No hay datos del quiz disponibles");
        return;
    }

    if (categoryId === 'todos') {
        currentQuestions = quizData.categories.flatMap(cat => cat.questions);
    } else {
        const category = quizData.categories.find(cat => cat.id === categoryId);
        currentQuestions = category ? [...category.questions] : [];
    }

    currentQuestions.sort(() => Math.random() - 0.5);

    currentQuestions = currentQuestions.slice(0, 20);

    currentIndex = 0;
    correctAnswersCount = 0;

    const scoreCounter = document.getElementById('score-counter');
    const displayCategory = document.getElementById('display-category');

    if (scoreCounter) scoreCounter.textContent = "0";
    if (displayCategory) displayCategory.textContent = categoryId.toUpperCase();

    document.getElementById('gamemode-section').style.display = 'none';
    document.getElementById('questions-section').style.display = 'block';
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const timerElement = document.getElementById('timer-counter');
        if (timerElement) {
            timerElement.textContent = formatTime(elapsed);
        }
    }, 1000);
    showNextQuestion();
}
function showNextQuestion() {
    if (currentIndex >= currentQuestions.length) {
        clearInterval(timerInterval);
        const finalTime = formatTime(Date.now() - startTime);

        localStorage.setItem('lastScore', correctAnswersCount);
        localStorage.setItem('totalQuestions', currentQuestions.length);
        localStorage.setItem('totalTime', finalTime); 

        window.location.href = 'results.html';
        return;
    }

    const q = currentQuestions[currentIndex];

    let optionsArray = [
        { key: 'A', text: q.options.A },
        { key: 'B', text: q.options.B },
        { key: 'C', text: q.options.C },
        { key: 'D', text: q.options.D }
    ];

    for (let i = optionsArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [optionsArray[i], optionsArray[j]] = [optionsArray[j], optionsArray[i]];
    }

    document.getElementById('question-text').textContent = q.text;

    const buttons = document.querySelectorAll('.options-grid .answer-btn');
    const ids = ['A', 'B', 'C', 'D'];

    buttons.forEach((btn, index) => {
        const option = optionsArray[index];

        const textSpan = document.getElementById(`text-${ids[index]}`);
        if (textSpan) {
            textSpan.textContent = option.text;
        }

        btn.onclick = () => checkAnswer(option.key);
    });
}
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
function checkAnswer(selectedOption) {
    const q = currentQuestions[currentIndex];

    if (selectedOption === q.correct) {
        correctAnswersCount++;
        document.getElementById('score-counter').textContent = correctAnswersCount;
    } else {
    }

    currentIndex++;
    showNextQuestion();
}

function resetGame() {
    document.getElementById('gamemode-section').style.display = 'block';
    document.getElementById('questions-section').style.display = 'none';
}
document.addEventListener("DOMContentLoaded", function () {

    const btnComencar = document.getElementById("btn-comencar");
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("modal-overlay");
    const btnContinuar = document.getElementById("btn-continuar");
    const inputNombre = document.getElementById("nameInput");

    btnComencar.addEventListener("click", function () {
        modal.style.display = "flex";
    });

    overlay.addEventListener("click", function () {
        modal.style.display = "none";
    });

    btnContinuar.addEventListener("click", function () {
        const nombre = inputNombre.value.trim();

        if (nombre === "") {
            alert("Si us plau, introdueix un nom.");
            return;
        }

        localStorage.setItem("nombreJugador", nombre);

        window.location.href = "questions.html";
    });

});