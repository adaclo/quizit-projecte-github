let quizData = null;
let currentIndex = 0;
let correctAnswersCount = 0;

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

    const scoreElement = document.getElementById('score');
    const totalElement = document.getElementById('total');
    const playerElement = document.getElementById('player');
    const restartButton = document.querySelector('button[onclick=""], .restart-btn'); // Buscamos el botón de reinicio

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

    showNextQuestion();
}
function showNextQuestion() {
    if (currentIndex >= currentQuestions.length) {
        localStorage.setItem('lastScore', correctAnswersCount);
        localStorage.setItem('totalQuestions', currentQuestions.length);
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