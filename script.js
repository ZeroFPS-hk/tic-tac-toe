const gameboard = (function(){
    const boardSize = 3;
    const board = [];
    for(let i=0; i<boardSize; i++){
        board[i] = [];
        for(let j=0; j<boardSize; j++){
            board[i][j] = gamecell();
        }
    }

    const getBoard = () => board;
    const getBoardSize = () => boardSize;
    const makeMove = (row, column, player) => {
        if(row >= boardSize || column >= boardSize) return false; //cell doesn't exist
        if(board[row][column].getValue()) return false; //cell already filled
        board[row][column].setValue(player);
        return true;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
        return boardWithCellValues;
    };

    const checkLineVictory = (arr) => arr.every(val => val === arr[0] && val);
    const checkVictory = () => {
        const boardWithCellValues = printBoard();
        for(i=0; i<boardSize; i++){
            if(checkLineVictory(boardWithCellValues[i])) return true; //row won
            let currentColumn = [];
            for(j=0; j<boardSize; j++){currentColumn.push(boardWithCellValues[j][i]);}
            if(checkLineVictory(currentColumn)) return true; //column won
        }
        let rightSlantDiagonal = [];
        let leftSlantDiagonal = [];
        for(i=0; i<boardSize; i++){
            rightSlantDiagonal.push(boardWithCellValues[i][i]);
            leftSlantDiagonal.push(boardWithCellValues[i][boardSize-1-i]);
        }
        if(checkLineVictory(rightSlantDiagonal)) return true;
        if(checkLineVictory(leftSlantDiagonal)) return true;
        return false; //the things I do to avoid hardcoding -.-
    };

    const checkBoardFull = () => {
        const boardWithCellValues = printBoard();
        for (let i=0; i<boardSize; i++){
            for(let j=0; j<boardSize; j++){
                if(!boardWithCellValues[i][j]) return false;
            }
        }
        return true;
    }

    const resetBoard = () => {
        for(let row of board){
            for(let cell of row){
                cell.resetCell();
            }
        }
    };

    return{getBoard, getBoardSize, makeMove, printBoard, checkVictory, checkBoardFull, resetBoard};
})();

function gamecell(){
    let value = "";
    const getValue = () => value;
    const setValue = (player) => {value = value || player;};
    const resetCell = () => {value = "";};
    return{getValue, setValue, resetCell};
}

const gameController = (function(){
    const player1 = "X";
    const player2 = "O";
    let currentPlayer = player1;
    const getCurrentPlayer = () => currentPlayer;
    const resetCurrentPlayer = () => {currentPlayer = player1;};
    const switchPlayer = () => {currentPlayer = currentPlayer === player1? player2: player1;};
    const makeMove = (row, column) => {
        let isSuccessfulMove = gameboard.makeMove(row, column, currentPlayer);
        if(isSuccessfulMove){
            if(gameboard.checkVictory()){
                console.log(currentPlayer + " is the winner!");
                return;
            }else{
                switchPlayer();
                console.log("It is now " + currentPlayer + " player's turn.");
            }
        }else{
            console.log("Illegal Move, please try again.")
        }
    };

    return{getCurrentPlayer, resetCurrentPlayer, makeMove};
})();

const displayController = (function(){
    const boardDisplay = document.querySelector("#gameboard");
    const messageDisplay = document.querySelector("#message");
    const buttonReset = document.querySelector(".reset");
    const boardSize  = gameboard.getBoardSize();
    
    const onCellClick = (e) => {
        let cellNumber = parseInt(e.target.id.slice(4));
        let row = Math.floor(cellNumber / boardSize);
        let column = cellNumber % boardSize;
        gameController.makeMove(row, column);
        displayBoard();
    };

    const checkGameEnd = () =>{
        let isGameEnded = false;
        if(gameboard.checkVictory()){
            messageDisplay.textContent = gameController.getCurrentPlayer() + " is the winner!"
            isGameEnded = true;
        }else if(gameboard.checkBoardFull()){
            messageDisplay.textContent = "It's a tie!"
            isGameEnded = true;
        }
        if(isGameEnded){
            const cells = document.querySelectorAll(".cell");
            for(const cell of cells){
                cell.removeEventListener("click", onCellClick);
            }
        }
    };

    const displayBoard = () => {
        const board = gameboard.printBoard();
        boardDisplay.replaceChildren();
        for(let i=0; i<boardSize; i++){
            let row = document.createElement("div");
            row.classList.add("row");
            for(let j=0; j<boardSize; j++){
                let cell = document.createElement("div");
                let cellNumber = i * boardSize + j;
                cell.classList.add("cell");
                cell.id = "cell" + cellNumber.toString();
                cell.textContent = board[i][j];
                cell.addEventListener("click", onCellClick);
                row.appendChild(cell);
            }
            boardDisplay.appendChild(row);
        }
        messageDisplay.textContent = "It is " + gameController.getCurrentPlayer() + " player's turn. Click on an empty square to make your move.";
        checkGameEnd();
    };
    displayBoard();

    const onResetButtonClick = () => {
        gameboard.resetBoard();
        gameController.resetCurrentPlayer();
        displayBoard();
    };
    buttonReset.addEventListener("click", onResetButtonClick);

})();