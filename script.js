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
            for(j=0; j<boardSize; j++){
                rightSlantDiagonal.push(boardWithCellValues[i][j]);
                leftSlantDiagonal.push(boardWithCellValues[i][boardSize-1-j]);
            }
        }
        if(checkLineVictory(rightSlantDiagonal)) return true;
        if(checkLineVictory(leftSlantDiagonal)) return true;
        return false; //the things I do to avoid hardcoding -.-
    };

    const resetBoard = () => {
        for(let row of board){
            for(let cell of row){
                cell.resetCell();
            }
        }
    };

    return{getBoard, makeMove, printBoard, checkVictory, resetBoard};
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

    return{getCurrentPlayer, makeMove};
})();