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

    const incrementTurn = () => {
        return turnCount++;
    };

    const takeTurn = (cell) => {
        let currentPlayer;
        let marker;
        if (turnCount % 2 === 0) {
            currentPlayer = player1.name;
            marker = player1.marker;
        } else {
            currentPlayer = player2.name;
            marker = player2.marker;
        }
        gameboard.setCell(cell, marker);
        turnCount++;
        return checkWin(currentPlayer);

    };

    const checkWin = (player) => {
        const board = gameboard.getBoard();

        for (let i = 0; i < board.length; i++) {
            if ((board[i] === "X" || board[i] === "O") && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                return `${player} wins!`;
            }
        }

        if (!board.includes(undefined)) {
            return "It's a tie!";
        }
    }

    const resetGame = () => {
        turnCount = 0;
        gameboard.resetBoard();
    }

    return { incrementTurn, takeTurn, checkWin, resetGame }
})();

console.log(gameboard.getBoard());
console.log(gameFlow.takeTurn(0));
console.log(gameFlow.takeTurn(8));
console.log(gameFlow.takeTurn(1));
console.log(gameFlow.takeTurn(7));
console.log(gameFlow.takeTurn(2));
console.log(gameFlow.resetGame());
console.log(gameboard.getBoard());
// console.log(gameFlow.takeTurn(6));
// console.log(gameFlow.takeTurn(3));
// console.log(gameFlow.takeTurn(5));
// console.log(gameFlow.takeTurn(4));
// console.log(gameboard.getBoard());

// Display/DOM Object

// Clean up interface - usernames, restart, results etc.