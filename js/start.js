// Get DOM elements
const startButtons = document.querySelector('.game-start-buttons');
const startScreen = document.querySelector('.startscreen');

// Global variables
let gameModeNum = 0;

//Show created and designed by
document.querySelector('footer').classList.remove('hide');

// Event listeners for start new game based on game mode
startButtons.addEventListener('click', (e) => {

    //Hide created and designed by
    document.querySelector('footer').classList.add('hide');

    if(e.target.innerHTML === "All") {
        gameModeNum = people.length;
    } else {
        gameModeNum = Number(e.target.innerHTML);
    }
    startScreen.classList.add('hide');

    // Starts new game based on the users choice
    newGame(gameModeNum);
});