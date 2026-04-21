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
// 1. Recuperar los datos guardados en el localStorage
    const finalScore = localStorage.getItem('lastScore') || 0;
    const totalQuestions = localStorage.getItem('totalQuestions') || 0;
    
    // Opcional: Si guardaste el nombre del jugador en el inicio
    const playerName = localStorage.getItem('playerName') || "Adrian";

    // 2. Referenciar los elementos del HTML
    const scoreElement = document.getElementById('score');
    const totalElement = document.getElementById('total');
    const playerElement = document.getElementById('player');
    const restartButton = document.querySelector('button');

    // 3. Insertar los datos en el HTML
    if (scoreElement) {
        scoreElement.textContent = `${finalScore}/${totalQuestions}`;
    }

    if (totalElement) {
        totalElement.textContent = totalQuestions;
    }

    if (playerElement) {
        playerElement.textContent = playerName;
    }

    // 4. Configurar el botón de reiniciar
    if (restartButton) {
        restartButton.addEventListener('click', () => {
            // Limpiamos los datos del juego anterior antes de volver
            localStorage.removeItem('lastScore');
            localStorage.removeItem('totalQuestions');
            
            // Redirigir a la página principal (ajusta el nombre si es distinto)
            window.location.href = 'index.html'; 
        });
    }
    const toggleButton = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
});

function startQuiz(categoryId) {
    if (!quizData) {
        return;
    }

    if (categoryId === 'todos') {
        currentQuestions = quizData.categories.flatMap(cat => cat.questions);
    } else {
        const category = quizData.categories.find(cat => cat.id === categoryId);
        currentQuestions = category ? [...category.questions] : [];
    }

    currentQuestions.sort(() => Math.random() - 0.5);

    currentIndex = 0;
    correctAnswersCount = 0;
    document.getElementById('score-counter').textContent = "0";
    document.getElementById('display-category').textContent = categoryId.toUpperCase();

    document.getElementById('gamemode-section').style.display = 'none';
    document.getElementById('questions-section').style.display = 'block';

    showNextQuestion();
}

function showNextQuestion() {
    if (currentIndex >= currentQuestions.length) {
        localStorage.setItem('lastScore', correctAnswersCount);
        localStorage.setItem('totalQuestions', currentQuestions.length);

        window.location.href = '../public/results.html';
        return;
    }

    const q = currentQuestions[currentIndex];
    document.getElementById('question-text').textContent = q.text;
    document.getElementById('text-A').textContent = q.options.A;
    document.getElementById('text-B').textContent = q.options.B;
    document.getElementById('text-C').textContent = q.options.C;
    document.getElementById('text-D').textContent = q.options.D;
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