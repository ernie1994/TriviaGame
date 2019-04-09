$(document).ready(function () {

    var questions = [
        {
            question: "Who is the rightful King of Westeros?",
            correct: "Jon Snow",
            incorrect: ["Gendry", "Danaerys", "Joffrey"]
        },
        {
            question: "Who is Robert Baratheon's best friend?",
            correct: "Ned Stark",
            incorrect: ["Tywin", "Jon Arryn", "Gendry"]
        },
        {
            question: "Who is Ygritte's husband?",
            correct: "Jon Snow",
            incorrect: ["Tormund", "Lord Baelish", "She is single"]
        },
        {
            question: "Which Kingdom is the largest?",
            correct: "The North",
            incorrect: ["Dorne", "Iron Islands", "The Reach"]
        },
        {
            question: "How did Daenerys Targaryen eventually hatch her dragon eggs?",
            correct: "In a funeral pyre",
            incorrect: ["In a frozen cave", "In a fire place", "In a lightning storm"]
        },
        {
            question: "The phrase 'Valar Morghulis' or 'all men must die' is usually responded with:",
            correct: "Valar Dohaeris or 'all men must serve'",
            incorrect: ["Valar Rohnas or 'all men must live'", "Valar Rohnas or 'all men must live'", "A response is forbidden"]
        },
        {
            question: "What is the only thing that can put out volatile Wildfire?",
            correct: "Sand",
            incorrect: ["Dragon's blood", "Sunlight", "Water"]
        },
    ];

    var questTimer;
    var transTimer;

    const MAX_TIME = 5;
    var timeRemaining = MAX_TIME;
    var currentQuest = 0;

    var numCorrect = 0;
    var numWrong = 0;
    var numUnanswered = 0;

    function createRow(html, rowClass, colClass) {

        var row = rowClass ? rowClass : "row";
        var col = colClass ? colClass : "col-12";

        var rowDiv = $("<div>");
        rowDiv.attr("class", row);

        var colDiv = $("<div>");
        colDiv.attr("class", col);
        colDiv.html(html);

        rowDiv.append(colDiv);

        $(".container").append(rowDiv);
    }

    function handleTimer() {

        timeRemaining--;

        if (timeRemaining == 0) {
            clearInterval(questTimer);
            numUnanswered++;
            showImage("Wall_Falling.jpg");
            showCorrectAnswer();
            transTimer = setTimeout(handleTransTimer, 1500);
            $("#question").text("Time's Up!");
        }
        updateTimeRemaining();
    }

    function updateTimeRemaining() {
        $("#time-remaining").text("Time Remaining: " + timeRemaining + " Seconds");
    }

    function showImage(imgName) {
        var img = $("<div>");
        img.html("<img src='assets/images/" + imgName + "'>");
        img.insertAfter("#question");

        $(".answerRow").remove();

    }

    function removeImage() {
        $("img").remove();
        $("#correct").remove();
    }

    function showCorrectAnswer() {
        var corr = $("<h5>");
        corr.attr("id", "correct");
        corr.text("Correct Answer: " + questions[currentQuest].correct);
        corr.insertBefore("img");
    }

    function handleTransTimer() {
        removeImage();
        currentQuest++;
        if (currentQuest === questions.length) {
            endGame();
        }
        else {
            showQuestion();
        }
    }

    function addAnswerRows() {
        for (var i = 0; i < 4; i++) {
            var rowClass = (i == 0) ? "answerRow row mt-3" : "answerRow";
            createRow("<h4 class='answer' id='answer" + i + "'></h4>", rowClass);
        }
    }

    function startGame() {
        timeRemaining = MAX_TIME;
        currentQuest = 0;

        numCorrect = 0;
        numWrong = 0;
        numUnanswered = 0;

        showQuestion();
    }

    function endGame() {

        $("#time-remaining").text("");

        $("#question").text("All done! Here's how you did!");

        var correctAnswers = "Correct Answers: " + numCorrect;
        createRow("<h6 class='result' id='correctAnswers'>" + correctAnswers + "</h6>");

        var incAnswers = "Incorrect Answers: " + numWrong;
        createRow("<h6 class='result'>" + incAnswers + "</h6>");

        var unanswered = "Unanswered: " + numUnanswered;
        createRow("<h6 class='result'>" + unanswered + "</h6>");

        createRow("<h2 id='restart'>Start Over?</h2");

    }

    function showQuestion() {

        var question = questions[currentQuest];

        $("#question").text(question.question);

        var answers = [];

        question.incorrect.forEach((q) => {
            answers.push(q);
        });

        var randomIndex = Math.floor(Math.random() * (answers.length + 1));

        answers.splice(randomIndex, 0, question.correct);

        addAnswerRows();

        for (var i = 0; i < answers.length; i++) {

            $("#answer" + i).text(answers[i]);
        }

        timeRemaining = MAX_TIME;
        questTimer = setInterval(handleTimer, 1000);

        updateTimeRemaining();

    }

    $("button").on("click", function () {
        $(this).remove();

        var time = '<h4 id="time-remaining"></h4>';
        createRow(time, "row mt-5");

        createRow('<h5 id="question"></h5>');

        startGame();
    });

    $("body").on("click", ".answer", function () {
        var question = questions[currentQuest];
        var answer = $(this).text();

        var imgName;

        if (answer == question.correct) {
            $("#question").text("Correct!");
            numCorrect++;
            imgName = "Ned_Stark.jpg";
        }
        else {
            $("#question").text("Nope!");
            numWrong++;
            imgName = "White_Walker.jpg";
        }

        showImage(imgName);

        if (answer != question.correct) {
            showCorrectAnswer();
        }

        transTimer = setTimeout(handleTransTimer, 1500);

        clearInterval(questTimer);
    });

    $("body").on("click", "#restart", function () {
        $(this).remove();
        $(".result").remove();
        startGame();
    });
});
