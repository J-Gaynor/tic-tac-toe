// Gameboard Object - single instance, IIFE?
const gameboard = (() => {
    let board = Array(9);

    const getBoard = () => {
        return board;
    }

    const setCell = (cell, marker) => {
        if (!board[cell]) {
            board[cell] = marker;
            return true;
        } return false
    }

    const resetBoard = () => {
        board = Array(9);
        return board;
    }

    return { getBoard, setCell, resetBoard }
})();


// Player Object
function Player(name, marker) {
    this.name = name;
    this.marker = marker;
    return { name, marker };
}

const player1 = Player("A", "X");
const player2 = Player("B", "O");

// Game Flow Object
const gameFlow = (() => {
    let turnCount = 0;
    let finished = true;

    const incrementTurn = () => {
        return turnCount++;
    };

    const currentPlayer = () => {
        if (turnCount % 2 === 0) {
            return player1;
        } else {
            return player2;
        }
    };

    const takeTurn = (cell, marker) => {
        console.log(finished)
        if (finished) {
            return "Start a new game to keep playing";
        }
        if (gameboard.setCell(cell, marker) === true) {
            incrementTurn();
            displayBoard.makeBoard();
            return checkWin(currentPlayer());
        };
    };

    const checkWin = () => {
        const board = gameboard.getBoard();

        for (let i = 0; i < board.length; i++) {
            if (checkHorizontal(board) || checkVertical(board) || checkDiagonal(board)) {
                finished = true;
                return "win";
            }
        }

        console.log(board)

        if (!board.includes(undefined)) {
            finished = true;
            return "tie";
        }
    }

    const checkHorizontal = (board) => {
        for (let i = 0; i < board.length; i++) {
            if ((board[i] !== undefined) && (board[i] === board[i + 1] && board[i] === board[i + 2] && i + 3 % 3 === 0)) {
                return true;
            }
        }
    }

    const checkVertical = (board) => {
        for (let i = 0; i < board.length; i++) {
            if ((board[i] !== undefined) && (board[i] === board[i + 3] && board[i] === board[i + 6])) {
                return true;
            }
        }
    }

    const checkDiagonal = (board) => {
        if ((board[4] !== undefined) && (board[0] === board[4] && board[0] === board[8] || board[2] === board[4] && board[2] === board[6])) {
            return true;
        }
    }

    const resetGame = () => {
        turnCount = 0;
        finished = false;
        gameboard.resetBoard();
    }

    const startGame = () => {
        finished = false;
    }

    return { takeTurn, checkWin, resetGame, currentPlayer, incrementTurn, startGame }
})();

// Display/DOM Object
const displayBoard = (() => {
    let container = document.querySelector(".container");

    const makeBoard = () => {
        container.replaceChildren();
        const board = gameboard.getBoard();
        const boardLength = board.length;

        for (let i = 0; i < boardLength; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.value = i;
            cell.textContent = board[i]
            container.appendChild(cell);
        }

        let cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.addEventListener("click", e => showMark(e)));
    }

    const showMark = (cell) => {
        let currentPlayer = gameFlow.currentPlayer();
        let playerMarker = currentPlayer.marker;
        const result = gameFlow.takeTurn(cell.target.value, playerMarker);
        if (result === "win") {
            alert(`${currentPlayer.name} wins!`);
        } else if (result === "tie") {
            alert("It's a tie! Press 'r' to replay.")
        };
    }
    return { makeBoard, showMark }
})();

// Clean up interface - usernames, restart, results etc.
const ui = (() => {
    const playerList = () => {
        const playerSection = document.querySelector(".players-container");
    }

    const rules = () => {
        const playerSection = document.querySelector(".rules-container");
        const startBtn = document.createElement("btn");
        const rules = document.createElement("p");
        startBtn.classList.add("startBtn");

        startBtn.textContent = "START GAME";
        rules.textContent = `Welcome to Tic Tac Toe! The classic game you know and love. \n
        Player 1 (X) and Player 2 (O) will take turns placing their markers on the grid.
        Markers can only be placed in empty tiles. A player wins by placing three of their
        markers in a row, either vertically, horizontally or diagonally. Super easy! \n`

        playerSection.appendChild(rules);
        playerSection.appendChild(startBtn);

        startBtn.addEventListener("click", () => gameFlow.startGame());
    }

    return { playerList, rules }
})();

displayBoard.makeBoard();
ui.rules();