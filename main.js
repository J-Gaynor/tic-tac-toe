// Gameboard Object - single instance, IIFE?
const gameboard = (() => {
    let board = Array(9);

    const getBoard = () => {
        return board;
    }

    const setCell = (cell, marker) => {
        if (!board[cell]) {
            board[cell] = marker;
            return board;
        } return `This cell already contains an ${board[cell]}.`
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
    let finished = false;

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

    const takeTurn = (cell) => {
        if (finished) {
            return "Start a new game to keep playing";
        }
        let marker;
        gameboard.setCell(cell, marker);
        return checkWin(currentPlayer());
    };

    const checkWin = (player) => {
        const board = gameboard.getBoard();

        for (let i = 0; i < board.length; i++) {
            if (checkHorizontal(board) || checkVertical(board) || checkDiagonal(board)) {
                finished = true;
                return `${player} wins! Press 'r' to replay.`;
            }
        }

        if (!board.includes(undefined)) {
            finished = true;
            return "It's a tie! Press 'r' to replay.";
        }
    }

    const checkHorizontal = (board) => {
        for (let i = 0; i < board.length; i++) {
            if ((board[i] !== undefined) && (board[i] === board[i + 1] && board[i] === board[i + 2] && board[i + 3] % 3 === 0)) {
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

    return { takeTurn, checkWin, resetGame, currentPlayer, incrementTurn }
})();

// Display/DOM Object
const displayBoard = (() => {
    let container = document.querySelector(".container");

    const makeBoard = () => {
        const boardLength = gameboard.getBoard().length;
        console.log(boardLength)
        for (let i = 0; i < boardLength; i++) {
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.value = i;
            container.appendChild(cell);
        }
        let cells = document.querySelectorAll(".cell");
        cells.forEach(cell => cell.addEventListener("click", e => showMark(e.target)));
    }

    const showMark = (cell) => {
        gameFlow.takeTurn(cell)
        if (cell.textContent === "") {
            cell.textContent = gameFlow.currentPlayer().marker;
            gameFlow.incrementTurn();
        }
    }

    return { makeBoard, showMark }
})();

displayBoard.makeBoard();

// Clean up interface - usernames, restart, results etc.