
const cells = document.querySelectorAll("#puzzle-board td");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const messageDisplay = document.getElementById("game-message");

const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8,
                     9, 10, 11, 12, 13, 14, 15, 0];

let board = [...solvedBoard];
let moves = 0;
let seconds = 0;
let timer;
let gameWon = false;

// Display the numbers on the puzzle board
function displayBoard() {
    cells.forEach((cell, index) => {
        const number = board[index];

        cell.textContent = number === 0 ? "" : number;
        cell.classList.toggle("empty", number === 0);

        cell.onclick = () => moveTile(index);
    });
}

// Check whether two positions are adjacent
function isAdjacent(first, second) {
    const row1 = Math.floor(first / 4);
    const col1 = first % 4;
    const row2 = Math.floor(second / 4);
    const col2 = second % 4;

    return Math.abs(row1 - row2) +
           Math.abs(col1 - col2) === 1;
}

// Move a tile into the empty space
function moveTile(index) {
    if (gameWon) return;

    const emptyIndex = board.indexOf(0);

    if (!isAdjacent(index, emptyIndex)) {
        return;
    }

    // Swap the selected tile with the empty space
    [board[index], board[emptyIndex]] =
        [board[emptyIndex], board[index]];

    moves++;
    movesDisplay.textContent = moves;

    displayBoard();
    checkWin();
}

// Update the timer
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerDisplay.textContent = "00:00";

    timer = setInterval(() => {
        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") + ":" +
            String(remainingSeconds).padStart(2, "0");
    }, 1000);
}

// Randomly shuffle the puzzle using legal moves
function shuffleBoard() {
    board = [...solvedBoard];

    let previousEmpty = -1;

    for (let i = 0; i < 200; i++) {
        const emptyIndex = board.indexOf(0);

        const possibleMoves = [];

        for (let j = 0; j < 16; j++) {
            if (isAdjacent(j, emptyIndex) &&
                j !== previousEmpty) {
                possibleMoves.push(j);
            }
        }

        const randomIndex = Math.floor(
            Math.random() * possibleMoves.length
        );

        const selected = possibleMoves[randomIndex];

        [board[selected], board[emptyIndex]] =
            [board[emptyIndex], board[selected]];

        previousEmpty = emptyIndex;
    }

    // Make sure the starting puzzle isn't already solved
    if (isSolved()) {
        shuffleBoard();
    }
}

// Determine whether the puzzle is solved
function isSolved() {
    return board.every((number, index) =>
        number === solvedBoard[index]
    );
}

// Check if the player has won
function checkWin() {
    if (isSolved()) {
        gameWon = true;
        clearInterval(timer);

        messageDisplay.textContent =
            "Congratulations! You solved the puzzle!";

        // Delay the message so the final tile appears first
        setTimeout(() => {
            const playAgain = confirm(
                "Congratulations! You won!\n\n" +
                "Moves: " + moves + "\n" +
                "Time: " + seconds + " seconds\n\n" +
                "Would you like to play again?"
            );

            if (playAgain) {
                newGame();
            }
        }, 500);
    }
}

// Start a new randomized game
function newGame() {
    shuffleBoard();

    moves = 0;
    gameWon = false;

    movesDisplay.textContent = moves;
    messageDisplay.textContent = "";

    displayBoard();
    startTimer();
}

// Start a simple game that takes one move to solve
function simpleGame() {
    board = [...solvedBoard];

    // Swap tile 15 with the empty position
    [board[14], board[15]] =
        [board[15], board[14]];

    moves = 0;
    gameWon = false;

    movesDisplay.textContent = moves;
    messageDisplay.textContent = "";

    displayBoard();
    startTimer();
}

// Connect the buttons to their functions
document.getElementById("new-game").onclick = newGame;
document.getElementById("simple-game").onclick = simpleGame;

// Automatically start the game when the webpage loads
newGame();
