// Get DOM elements
const scoreScreen = document.querySelector('.scorescreen');
const resultList = document.querySelector('.result-list');
const overallScore = document.querySelector('.score-game-list');
const latestScore = document.querySelector('.score-latest');
const newQuitBt = document.querySelector('.new-quit-game');

const scoreList = () => {
    scoreScreen.classList.remove('hide');

    //  Empty the DOM before loading in new results
    resultList.innerHTML = ``;
    overallScore.innerHTML = ``;

    // Sort the array with the latest game first
    gameScoreCounter.sort((a, b) => b.gamenum - a.gamenum);

    // Get the highest score
    const highestScoreArr = gameScoreCounter.map(score => {
        return score.score;
    })
    const highestScore = Math.max(...highestScoreArr);

    let scoreStar = ``;

    // Show the overall score list from each game
    gameScoreCounter.forEach(scores => {

        // Set a star on the highest score in the list.
        if(scores.score === highestScore) {
            scoreStar = `&#11088;`;
        } else {
            scoreStar = ``;
        }

        overallScore.innerHTML +=`
            <div class="game-item">
                <span class="game-number">Game ${scores.gamenum}</span>
                <span class="highest-score" data-score="${scores.score}">${scoreStar}</span>
                <span class="game-points">${scores.score}p</span>
            </div>
         `;
    })

    // Display the latest score number
    latestScore.innerHTML = `${points} of ${gameModeNum}`;

    // Display items from latestResults during last game
    latestResult.forEach(person => {
        resultList.innerHTML += `
            <div class="result-item">
                <div class="result-image">
                    <img src="assets/${person.image}" alt="${person.image}">
                </div>
                <div class="result-name " data-result="${person.result}">
                    ${person.name}
                </div>
            </div>
        `;
    })
    // Set the result with color
    const setResult = document.querySelectorAll('.result-name');
    setResult.forEach(resultItem => {
        if(resultItem.dataset.result === 'true') {
            resultItem.classList.add('bg-correct')
        } else {
            resultItem.classList.add('bg-incorrect')
        }
    })
}

// Clicking och Play again or Quit.
newQuitBt.addEventListener('click', (e) => {
    if(e.target.classList.contains('playagain')) {
        scoreScreen.classList.add('hide');
        // Start the function for fresh Array and then a new game loop.
        newGame(gameModeNum);
    } else if(e.target.classList.contains('quit')) {
        location.reload();
    }
});