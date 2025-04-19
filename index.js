document.addEventListener("DOMContentLoaded", () =>{

    // Define URL
    const TRIVIA_URL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";

    let allQuestions;
    let incorrectAnswers = [];
    let currentQuestion = 0;
    let correctAnswer = "";
    let correctScores = 0;
    let incorrectScores = 0;

    const startBtn = document.getElementById("start");
    // const checkScoreBtn = document.getElementById("check-score");
    const reloadBtn = document.getElementById("reload");

    // Event litseners
    startBtn.addEventListener("click", loadTriviaData);
    reloadBtn.addEventListener("click", () => location.reload());
    // checkScoreBtn.addEventListener("click", () => {
    //     alert(`👏👏 correct scores: ${correctScores}/${allQuestions.length}\n👎 incorrect scores: ${incorrectScores}/${allQuestions.length}`);
    // });


    // Decode HTML entities
    const HTMLEntitiesDecoder = (html) => {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    };

    // load API data
    function loadTriviaData() {
        fetch(TRIVIA_URL)
            .then(res => res.json())
            .then(data => {
                allQuestions = data.results;
                currentQuestion = 0;
                correctScores = 0;
                incorrectScores = 0;
                updateUserScore();
                loadQuestion();
            });
    }

    // Display the current question in the question box and the answer in the answer box
    const questionSection = document.getElementById("question");
    const answerSection = document.getElementById("answer");

    function loadQuestion() {
        const current = allQuestions[currentQuestion];
        questionSection.innerHTML = `<strong>Q${currentQuestion + 1}:</strong> ${HTMLEntitiesDecoder(current.question)}`;
        correctAnswer = current.correct_answer;

        let answers = [...current.incorrect_answers];
        answers.splice(Math.floor(Math.random() * (answers.length + 1)), 0, correctAnswer);

        answerSection.innerHTML = `<strong>Select your Answer:</strong><br>`;
        answers.forEach(answer => {
            const label = document.createElement("label");
            label.innerHTML = `
                <input type="checkbox" name="answer" value="${answer}">
                ${HTMLEntitiesDecoder(answer)}<br>
            `;
            answerSection.appendChild(label);
        });
    }

    // Advance after answer selection
    answerSection.addEventListener("change", (e) => {
        if (e.target && e.target.matches("input[type='checkbox']")) {
            const checkboxes = document.querySelectorAll("input[name='answer']");
            checkboxes.forEach(box => {
                if (box !== e.target) box.checked = false;
            });
            verifyUserAnswer();
        }
    });

    // Check answer and move to next question
    // Display the questions the user got wrong, the option they picked, then display the correct answer for each question

    const incorrectScore = document.getElementById("incorrect");
    const correctScore = document.getElementById("score");
    let correctedOptions = document.getElementById("corrected");

    function verifyUserAnswer() {
        const selected = document.querySelector("input[name='answer']:checked");
        if (!selected) return;

        const userAnswer = selected.value;

        if (userAnswer === correctAnswer) {
            correctScores++;
            answerSection.innerHTML += "<br>👏👏 Bingo!";
        } else {
            incorrectScores++;
            incorrectAnswers.push({
                question: allQuestions[currentQuestion].question,
                selected: userAnswer,
                correct: correctAnswer
            });
            answerSection.innerHTML += `<br>👎 Wrong answer!`;
        }

        updateUserScore();

        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < allQuestions.length) {
                loadQuestion();
            } else {
                answerSection.innerHTML += "<br><strong>🎇🎆 Big up champ, Quiz complete!</strong>"
                if (incorrectAnswers.length > 0) {
                    correctedOptions.innerHTML = "<h3>Oops! You got the following questions wrong:</h3>";
                
                    incorrectAnswers.forEach(item => {
                        correctedOptions.innerHTML += `
                            <div style="margin-bottom: 1em;">
                                <strong>Q:</strong> ${HTMLEntitiesDecoder(item.question)}<br>
                                <strong>Your answer:</strong> ${HTMLEntitiesDecoder(item.selected)}<br>
                                <strong>Correct answer:</strong> ${HTMLEntitiesDecoder(item.correct)}
                            </div><hr>
                        `;
                    });
                } else {
                    correctedOptions.innerHTML = "<h3>🔥🔥 You crushed everything ! You are on a roll !.</h3>";
                }
            }
        }, 2000);
    }

    // Update correct and incorrect score boxes
    function updateUserScore() {
        correctScore.textContent = `Correct: ${correctScores}/ ${allQuestions.length}`;
        incorrectScore.textContent = `Incorrect: ${incorrectScores}/ ${allQuestions.length}`;
    }

});

