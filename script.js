
let currentQuestion = 0;
let score = 0;

let questions = [];
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    } // I NEED TO CHECK WHAT THE HELL IS THIS 
    return array;
}

fetch('data/questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        shuffleArray(questions);
        showQuestion();
    })
     .catch(error => {
    console.error("Failed to load questions:", error);
    questionEl.textContent = "Failed to load quiz questions.";
  });

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const quizBtn = document.getElementById('quiz-btn');
const resultEl = document.getElementById('result');
const flagEL = document.getElementById('flag');
const scoreEl = document.getElementById('score-track');

quizBtn.addEventListener('click', () => {
  if (quizState === "Submit") {
    submitAnswer();
  } else if (quizState === "Next") {
    currentQuestion++;
    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      showFinalResult();
    }
  }
});

function showQuestion() {
    const q = questions[currentQuestion];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = '';
    resultEl.textContent = '';
    flagEL.innerHTML = `<img src="${q.flag}" alt="Flag" class="flag">`;
    scoreEl.textContent = `Streak 🔥 : ${score}`;
  q.options.forEach(option => {
    const btn = document.createElement('button');
    btn.textContent = option;
    btn.classList.add('option-btn');

    btn.addEventListener('click', () => {
        const isSelected = btn.classList.contains('selected');

        // Deselect all
        document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));

        // Toggle this one
        if (!isSelected) {
            btn.classList.add('selected');
        }
    });
    optionsEl.appendChild(btn);
});

    quizBtn.textContent = "Submit";
    quizState = "Submit";
} 

function submitAnswer () {
    const selectedBtn = document.querySelector('.option-btn.selected');
    if (!selectedBtn) {
        alert("Please select an answer!");
        return;
    }

const selectedTxt = selectedBtn.textContent;
const correct = questions[currentQuestion].answer

    if (selectedTxt === correct) {
        score++;
        resultEl.textContent = "✅ Correct!";
        selectedBtn.classList.remove('selected');
        selectedBtn.classList.add('correct');
        confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 } }
      );      

    } else {
        resultEl.textContent = `❌ Wrong! Correct answer: ${correct}`;
        selectedBtn.classList.remove('selected');
        selectedBtn.classList.add('wrong');
        score = 0;

        document.querySelectorAll('.option-btn').forEach(btn => {
      if (btn.textContent === correct) {
        btn.style.backgroundColor = "green";
       }
      });
    }
     document.querySelectorAll(".option-btn").forEach(btn => {
        btn.disabled = true;
        btn.classList.add("disabled-hover");
});

     quizBtn.textContent = currentQuestion < questions.length -1 ? "Next" : "Finish";
     quizState = "Next";

}  

function fitTxt() {
  $('.question').fitText(1.1, {
    minFontSize: '14px',
    maxFontSize: '20px'
  });
}

$(fitTxt);

