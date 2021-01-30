/*----- constants -----*/
const INITIAL_TIME = 30

/*----- app's state (variables) -----*/
// varaible store timer's countdown
let timeRemaining = 0
// store our timer's setInterval so we can clear it
let countdown = null
// boolean for game over
let gameOver = false
// keep track of clicked wires
let wireState = {
    blue: false,
    green: false,
    red: false,
    white: false,
    yellow: false
}
// array of wires that need to be clicked to win the game
let wiresToCut = []

/*----- cached element references -----*/
// event listeners on the wires
let wireboxEl = null

// each wire element
let wires = []

// backdrop image
let backgroundEl = null

// timer
let timerEl = null

// reset button
let resetButtonEl = null

// I want this function to run every second.
function updateClock() {
    // console.log('countdown the timer!')
    // Decrement timeRemaining, if there is no time left, end the game
    timeRemaining = timeRemaining - 1;
    if(timeRemaining <= 0) {
        //end the game
        endGame(false); // endgame.. we lost

    }

    // Update clock text with the timeRemaining
    timerEl.textContent = "0:00:" + timeRemaining;
}

// runs to set up game state
function initializeGame() {
    // Set the remaining time variable
    timeRemaining = INITIAL_TIME;
    gameOver = false
    wiresToCut = []
    wireState = {
        blue: false,
        green: false,
        red: false,
        white: false,
        yellow: false
    }

    // Start the countdown interval
    countdown = setInterval(updateClock, 1000) // Runs the updateClock() every second

    // Randomly select which wires need to be cut
    for(const color in wireState) {
        // console.log(color);
        let rand = Math.random() // gives us a random float between 0.0 and 1.0
        if(rand > 0.5) {
            wiresToCut.push(color);
        }
    }
}

// handles reset button click
function resetGame() {
    console.log('reset game! 👾')
    // Update the gameOver state variable
    gameOver = false;

    // timeRemaining = INITIAL_TIME;

    // Display the SimCity bg
    backgroundEl.style.backgroundImage = "url(img/simcity.jpg)";

    // Set the clock text back to red

    // Clear any intervals or timeouts
    clearInterval(countdown);


    // invoke initializeGame()
    initializeGame();
}

// handles reset button click
function cutWire(event) {
    let wireColor = event.target.id;
    console.log('You cut the ' + wireColor + " wire");
    // If the wire is cuttable, cut it, update game state variables and apply the 
    // appropriate cut-wire image

    // if it is a good cut, update state, if it is a bad cut, you lose the game
    if(!gameOver && wireState[wireColor] === false) {
        // Change the picture to the cut wire
        event.target.src = `img/cut-${wireColor}-wire.png`
        // Update the state variable w/ the wire that we cut
        wireState[wireColor] = true;
        
        // Did we cut a good wire or a bad wire?
        if(wiresToCut.includes(wireColor)) {
            // that was the correct wire!
            // remove the wire from the wiresToCut
            wiresToCut.splice(wiresToCut.indexOf(wireColor), 1)
            if(wiresToCut.length === 0) {
                //no more wires to cut! We win the game
                endGame(true);
            }
        } else {
            // that was the wrong wire - end the game
            endGame(false);
        }
        
    }

  
    // If there's no more wires that need to be cut - win the game

}




// handle game over state 
function endGame(isGameWon) {
    console.log('END GAME 💣')
    // Clear the countdown and update gameOver state variable
    clearInterval(countdown);
    gameOver = true;

    // If the passed in isGameWon argument is true, set the timer text to green
    // Otherwise, change the background image to the explosion

    if(isGameWon) {
        // If we won, change text color to green
        console.log("Hooray Patrick! We saved the city!")
        timerEl.style.color = "green"
    } else {
        // But if we lost, change the background image to the exploded city pic
        console.log('Barnacles! The city exploded!')
        backgroundEl.style.backgroundImage = "url(img/explosion.jpg)";
    }
}

/*----- event listeners -----*/
document.addEventListener('DOMContentLoaded', function () {
    console.log('loaded!');
    // <main> element to manippulte the backgorund 
    backgroundEl = document.querySelector('main')
    // countdown timer element
    timerEl = document.querySelector('#timer')
    // reset button to reset the game
    resetButtonEl = document.querySelector('#reset')
    resetButtonEl.addEventListener('click', resetGame)
    // wirebox and click event listener
    wireboxEl = document.querySelector('#wirebox')
    wireboxEl.addEventListener('click', cutWire)
    // each wire element in an array
    wires = wireboxEl.children
    // init the game
    initializeGame()
})