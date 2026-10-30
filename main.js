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
    this.wins = 0;
    return { name, marker, wins };
}

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
        let startBtn = document.querySelector(".start-btn");

        for (let i = 0; i < board.length; i++) {
            if (checkHorizontal(board) || checkVertical(board) || checkDiagonal(board)) {
                finished = true;
                startBtn.classList.toggle("hidden");
                return "win";
            }
        }

        if (!board.includes(undefined)) {
            startBtn.classList.toggle("hidden");
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
            currentPlayer.wins++;
            ui.setMessage(`${currentPlayer.name} wins!`);
        } else if (result === "tie") {
            ui.setMessage("It's a tie!");
        };
    }
    return { makeBoard, showMark }
})();

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

// Clean up interface - usernames, restart, results etc.
const ui = (() => {
    let message = "";

    const setMessage = (msg) => {
        message = msg;
        playerList();
    };

    const playerList = () => {
        const playerSection = document.querySelector(".players-container");
        playerSection.replaceChildren();
        const player1Div = document.createElement("div");
        const player2Div = document.createElement("div");
        player1Div.classList.add("playerDiv");
        player2Div.classList.add("playerDiv");

        const player1Header = document.createElement("div");
        player1Header.classList.add("player-header");
        const player1Name = document.createElement("p");
        const player1EditBtn = document.createElement("button");
        const player1Wins = document.createElement("p");
        player1Name.textContent = player1.name;
        player1EditBtn.textContent = "✏️";
        player1EditBtn.classList.add("edit-btn");
        player1Wins.textContent = `Wins: ${player1.wins}`;

        player1Header.appendChild(player1Name);
        player1Header.appendChild(player1EditBtn);
        player1Div.appendChild(player1Header);
        player1Div.appendChild(player1Wins);

        player1EditBtn.addEventListener("click", () => { setName(player1) });

        const player2Header = document.createElement("div");
        player2Header.classList.add("player-header");
        const player2Name = document.createElement("p");
        const player2EditBtn = document.createElement("button");
        const player2Wins = document.createElement("p");
        player2Name.textContent = player2.name;
        player2EditBtn.textContent = "✏️";
        player2EditBtn.classList.add("edit-btn");
        player2Wins.textContent = `Wins: ${player2.wins}`;

        player2Header.appendChild(player2Name);
        player2Header.appendChild(player2EditBtn);
        player2Div.appendChild(player2Header);
        player2Div.appendChild(player2Wins);

        playerSection.appendChild(player1Div);
        playerSection.appendChild(player2Div);

        if (message) {
            const resultMsg = document.createElement("p");
            resultMsg.classList.add("result-message");
            resultMsg.textContent = message;
            playerSection.appendChild(resultMsg);
        }

        player2EditBtn.addEventListener("click", () => { setName(player2) });
    }

    const rules = () => {
        const playerSection = document.querySelector(".rules-container");
        const startBtn = document.createElement("button");
        const rules = document.createElement("p");
        startBtn.classList.add("start-btn");

        startBtn.textContent = "START GAME";
        rules.textContent = `Welcome to Tic Tac Toe! The classic game you know and love. \n
        Player 1 (X) and Player 2 (O) will take turns placing their markers on the grid.
        Markers can only be placed in empty tiles. A player wins by placing three of their
        markers in a row, either vertically, horizontally or diagonally. Super easy! \n`

        playerSection.appendChild(rules);
        playerSection.appendChild(startBtn);

        startBtn.addEventListener("click", () => {
            startBtn.classList.toggle("hidden");
            startBtn.textContent = "PLAY AGAIN";
            gameFlow.resetGame();
            displayBoard.makeBoard();
            gameFlow.startGame();
            setMessage("");
        });
    }

    const setName = (player) => {
        const newName = prompt("Player name:");
        if (newName && newName.trim() !== "") {
            player.name = newName.trim();
            playerList();
        }
    }

    return { playerList, rules, setMessage }
})();

displayBoard.makeBoard();
ui.rules();
ui.playerList();