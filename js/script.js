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
        alert(`¡Fin! Aciertos: ${correctAnswersCount}`);
        resetGame();
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