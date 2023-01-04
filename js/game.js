// Get DOM elements
const gameScreen = document.querySelector('.gamescreen');
const personImage = document.querySelector('.person-image');
const radioBt = document.querySelector('.radio-options');
const peopleForm = document.querySelector('#options');
const formBt = document.querySelector('.form-buttons');
const pointCounter = document.querySelector('.points');

// Declare Global variables
let cPeople = people; // When the game starts for the first time, set it = to people
let playedPersona = []; // Array to filter out played persons.
let selectedPerson = 0; // Variable for the random number that picks the correct answer.
let formNumber = 1; // Get the form elements a new number each "loop".
let peopleGame = []; // Stores the new Array with 4 people.
let points = 0; // Game score
let gameCounter = 0; // Counts the number of games that are played
let gameScoreCounter = []; // Saves the results from each game

// Function to set up the next game.
const newGame = (resetGameMode) => {
    // Start new game loop with fresh array
    cPeople = people;
    points = 0;
    formNumber = 1;
    gameScreen.classList.remove('hide');
    pointCounter.innerHTML = `0 Points`;
    latestResult = []; // Saves the results from each game
    playedPersona = []; // Array to filter out played persons.
    nextPersonBt.innerHTML = `Next <span class="material-symbols-outlined">navigate_next</span>`;
    gameStart();
    updateQuestionBar(formNumber, resetGameMode);

    // Adds number to new game
    gameCounter++;
    // Show game number
    document.querySelector('.game-number-sub').innerHTML = `Game ${gameCounter}`;
}

// Start game loop
const gameStart = () => {
    // Clear the DOM from data
    radioBt.innerHTML = ``;

    // Disable both buttons
    formBt.querySelector('.checkbt').setAttribute('disabled','');
    formBt.querySelector('.nextbt').setAttribute('disabled','');

    // Get the array and shuffle it with the Fisher-Yates function.
    const peopleShuffle = fyShuffle(cPeople);

    // This is the late game code (All-mode gameplay) that checks if the array starts to run out of people and import already played persons as choices.
    let numberTypes = peopleShuffle
        .filter(typeItem => typeItem.type === peopleShuffle[0].type)
        .map(typeItem => typeItem.type);

    if(numberTypes.length < 4) {
        let whosNext = 0;
        while(whosNext < 15) {
            whosNext++;
            peopleShuffle.push(latestResult[whosNext]);
        }
    }

    // Filter the array type based on the first person in the Array.
    // Slice to 4 names
    peopleGame = peopleShuffle
        .filter(persons => persons.type === peopleShuffle[0].type)
        .slice(0,4);

    // Call function that gives a random number between 0-3.
    selectedPerson = answerNumber();

    // This checks if it is backup persons from already played games so the last persons can be played.
    while('result' in peopleGame[selectedPerson]) {
        selectedPerson -= 1;
    }

    // Print the data to the DOM and set up the correct answer in the form
    // Main image of selected person based on Random number
    personImage.innerHTML = `<img src="../assets/${peopleGame[selectedPerson].image}" alt="${peopleGame[selectedPerson].image}">`;

    // Get the data and print the array with all options
    // Note to self: Tabindex is only there for if you use an Ipad or some Apple touch product. For some reason it can´t handle the within-focus parameter as of Android. Weird!
    peopleGame.forEach(persons => {
        radioBt.innerHTML += `
            <label class="label-answer" for="${persons.id}" id="label-${persons.id}" tabindex="0">
              <input type="radio" id="${persons.id}" name="${formNumber}" value="${persons.id}">
              ${persons.name}
            </label>
        `;
    })
}

// Activate check answer button when user clicks on an radio input.
peopleForm.addEventListener('click', e => {
    if (e.target.tagName === 'INPUT') {
        formBt.querySelector('.checkbt').removeAttribute('disabled');
    }
})

// Form functions when user checks the answer
peopleForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Stores if the answer was correct or not
    let isCorrect = false;

    // Check the answer
    peopleGame.forEach(persons => {
        // Get the radiobutton that is checked
        const checkedRadio = document.querySelector('input[id="'+persons.id+'"]:checked');
        // Check the ID if the position in the Array is same as the selectedPerson
        if(checkedRadio) {
            const getAnswer = Number(checkedRadio.getAttribute('id'));
            const labelFeedback = document.querySelector("#label-"+getAnswer);
            if(getAnswer === peopleGame[selectedPerson].id) {
                points++
                isCorrect = true;
                //labelFeedback.classList.add('bg-correct');
                labelFeedback.setAttribute('class','bg-correct-button');
            } else {
                //labelFeedback.classList.add('bg-incorrect');
                labelFeedback.setAttribute('class','bg-incorrect-button');
                // Mark the correct answer to the user.
                const correctAnswer = document.querySelector("#label-"+peopleGame[selectedPerson].id);
                correctAnswer.setAttribute('class','bg-correct-button');
                //correctAnswer.classList.add('bg-correct');
            }
        }
    })
    // Disable the checkbutton when pressed and enable the next button.
    formBt.querySelector('.checkbt').setAttribute('disabled','');
    formBt.querySelector('.nextbt').removeAttribute('disabled');

    // Disable the radio buttons so the user cant input new answers.
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(radios => {
        radios.setAttribute('disabled', '');
    });

    // Disable the color feedback for the user when a choice has been made.
    // Note to self: This is only because Ipad and Iphone cant handle "focus-within" like normal browser.
    const labelFeedbackDisabled = document.querySelectorAll('label');
    labelFeedbackDisabled.forEach(labels => {
        if(!labels.classList.contains('bg-correct-button') && !labels.classList.contains('bg-incorrect-button')) {
            labels.setAttribute('class', 'label-answer-unfocused');
        }
    });


    // Update points in the game view
    pointCounter.innerHTML = `${points} Points`;

    // Saves the user choice and displays in at the end of the game.
    // This array is also being used to fill upp answers in the late game (when playing all).
    latestResult.push({
        id: peopleGame[selectedPerson].id,
        name: peopleGame[selectedPerson].name,
        image: peopleGame[selectedPerson].image,
        type: peopleGame[selectedPerson].type,
        result: isCorrect
    })

    //Change the text on the next button on the last question
    if(formNumber > gameModeNum-1) {
        nextPersonBt.innerText = "Finish";
    }

});

// Function to set the questionBar in the start and then updates on every question
let updateQuestionBar = (formNumber, gameModeNum) => {
    // Calculate the percentage of total number of questions
    let questionPercent = (formNumber/gameModeNum)*100;

    if(questionPercent < 30) {
        questionPercent = 31; // This so the bar isnt to small
    }

    questionBar.innerHTML = `
        <div class="question-numbers" style="width: ${questionPercent}%;">
            ${formNumber} of ${gameModeNum}
        </div>
    `;
}

// Get the next button and the number of questions bar
const nextPersonBt = formBt.querySelector('.nextbt');
const questionBar = document.querySelector('.questionbar-background');

// When the user clicks the NEXT button
nextPersonBt.addEventListener('click', () => {
    // Add one to formNumber for the name attribute in the form.
    formNumber++;

    // Push the selected person to Filter out array in the next game loop.
    playedPersona.push(peopleGame[selectedPerson]);

    cPeople = people.filter(perId => !playedPersona.includes(perId));

    // Call the function to update the question bar
    updateQuestionBar(formNumber, gameModeNum);

    // Check if the game loop reaches the amount in game mode
    if(formNumber > gameModeNum) {
        //gameCounter++;

        // variable that stores number of games. Put it in a new Array.
        gameScoreCounter.push({
            gamenum: gameCounter,
            score: points
        })
        // Hide the game screen and go to the Score list.
        gameScreen.classList.add('hide');
        scoreList();
    } else {
        // Start new game loop
        gameStart();
    }
})

const mainScreen = document.querySelector('main');
// Checks if the player clicks outside the game form
mainScreen.addEventListener('click', (e) => {
    if(e.target.tagName === 'MAIN') {
        formBt.querySelector('.checkbt').setAttribute('disabled','');
    }
})


// Get a random number between 0-3 to select correct answer in the array.
// This also "shuffles" the placement of correct answer in the form.
function answerNumber () {
    return Math.floor(Math.random() * (3 + 1));
}

// The Fisher-Yates shuffle function
function fyShuffle(arr) {
    let i = arr.length;
    while (--i > 0) {
        let randIndex = Math.floor(Math.random() * (i + 1));
        [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
    }
    return arr;
}