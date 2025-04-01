document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const welcomePage = document.getElementById('welcome-page');
    const rulesPage = document.getElementById('rules-page');
    const gamePage = document.getElementById('game-page');
    const resultsPage = document.getElementById('results-page');
    
    const startBtn = document.getElementById('start-btn');
    const beginGameBtn = document.getElementById('begin-game-btn');
    const playAgainBtn = document.getElementById('play-again-btn');
    
    const playerNameInput = document.getElementById('player-name');
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const clearBtn = document.getElementById('clear-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    const timerElement = document.getElementById('timer');
    const scoreElement = document.getElementById('score');
    const questionCountElement = document.getElementById('question-count');
    
    const playerResultElement = document.getElementById('player-result');
    const finalScoreElement = document.getElementById('final-score');
    const performanceMessageElement = document.getElementById('performance-message');

    // Game variables
    let playerName = '';
    let score = 0;
    let currentQuestion = 0;
    let totalQuestions = 20;
    let timer;
    let timeLeft;
    let correctAnswer;
    let questionsAnswered = 0;
    
    // Time limits for different question ranges
    const timeLimits = {
        '1-10': 30,
        '11-15': 20,
        '16-20': 15
    };
    
    // Page navigation
    startBtn.addEventListener('click', function() {
        welcomePage.classList.remove('active');
        rulesPage.classList.add('active');
    });
    
    beginGameBtn.addEventListener('click', function() {
        playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Please enter your name to continue.');
            return;
        }
        
        rulesPage.classList.remove('active');
        gamePage.classList.add('active');
        startGame();
    });
    
    playAgainBtn.addEventListener('click', function() {
        resultsPage.classList.remove('active');
        welcomePage.classList.add('active');
        resetGame();
    });
    
    // Game functions
    function startGame() {
        score = 0;
        currentQuestion = 1;
        questionsAnswered = 0;
        updateScore();
        generateQuestion();
    }
    
    function resetGame() {
        clearInterval(timer);
        score = 0;
        currentQuestion = 0;
        questionsAnswered = 0;
        answerInput.value = '';
    }
    
    function generateQuestion() {
        // Determine if it's addition or subtraction (random)
        const isAddition = Math.random() > 0.5;
        let num1, num2;
        
        if (isAddition) {
            // Generate two-digit numbers for addition
            num1 = Math.floor(Math.random() * 50) + 10;
            num2 = Math.floor(Math.random() * 50) + 10;
            correctAnswer = num1 + num2;
            questionElement.textContent = `${num1} + ${num2} = ?`;
        } else {
            // Generate two-digit numbers for subtraction (ensure positive result)
            num1 = Math.floor(Math.random() * 50) + 50;
            num2 = Math.floor(Math.random() * 40) + 10;
            correctAnswer = num1 - num2;
            questionElement.textContent = `${num1} - ${num2} = ?`;
        }
        
        // Set the timer based on question number
        if (currentQuestion <= 10) {
            timeLeft = timeLimits['1-10'];
        } else if (currentQuestion <= 15) {
            timeLeft = timeLimits['11-15'];
        } else {
            timeLeft = timeLimits['16-20'];
        }
        
        updateQuestionCount();
        startTimer();
        answerInput.value = '';
        answerInput.focus();
    }
    
    function startTimer() {
        clearInterval(timer);
        updateTimerDisplay();
        
        timer = setInterval(function() {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                handleTimeout();
            }
        }, 1000);
    }
    
    function updateTimerDisplay() {
        timerElement.textContent = `Time: ${timeLeft}s`;
    }
    
    function handleTimeout() {
        questionsAnswered++;
        score -= 1;
        updateScore();
        moveToNextQuestion();
    }
    
    function updateScore() {
        scoreElement.textContent = `Score: ${score}`;
    }
    
    function updateQuestionCount() {
        questionCountElement.textContent = `Question: ${currentQuestion}/${totalQuestions}`;
    }
    
    // Button event listeners
    clearBtn.addEventListener('click', function() {
        answerInput.value = '';
    });
    
    submitBtn.addEventListener('click', function() {
        submitAnswer();
    });
    
    answerInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    });
    
    function submitAnswer() {
        const userAnswer = parseInt(answerInput.value);
        
        if (isNaN(userAnswer)) {
            alert('Please enter a valid number');
            return;
        }
        
        clearInterval(timer);
        questionsAnswered++;
        
        if (userAnswer === correctAnswer) {
            score += 2;
        } else {
            score -= 1;
        }
        
        updateScore();
        moveToNextQuestion();
    }
    
    function moveToNextQuestion() {
        currentQuestion++;
        
        if (currentQuestion > totalQuestions) {
            endGame();
        } else {
            setTimeout(generateQuestion, 1000);
        }
    }
    
    function endGame() {
        gamePage.classList.remove('active');
        resultsPage.classList.add('active');
        
        playerResultElement.textContent = `${playerName}, your final score is:`;
        finalScoreElement.textContent = score;
        
        // Performance message based on score
        let performanceMessage;
        if (score >= 30) {
            performanceMessage = "Outstanding! You're a math wizard!";
        } else if (score >= 20) {
            performanceMessage = "Excellent work! You're really good at this!";
        } else if (score >= 10) {
            performanceMessage = "Good job! You've got solid math skills!";
        } else if (score >= 0) {
            performanceMessage = "Not bad! Keep practicing to improve!";
        } else {
            performanceMessage = "Keep trying! Math gets easier with practice!";
        }
        
        performanceMessageElement.textContent = performanceMessage;
        
        // Send results to server (simulated)
        sendResultsToServer(playerName, score);
    }
    
    // Simulated function to send results to server
    function sendResultsToServer(name, score) {
        // Replace this with your actual web app URL from Step 3
        const webAppUrl = "https://script.google.com/macros/s/AKfycbzcKrtGYDlIpBurRXdHAB4B2P35d0w7gMRPwcFqHcX_aSqYPzs4cAkeQEmfMFinHSlj5g/exec";
        
        const data = {
            playerName: name,
            score: score
        };
    
        fetch(webAppUrl, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(() => {
            console.log('Results sent to Google Sheet');
        })
        .catch(error => {
            console.error('Error saving results:', error);
        });
    }
});