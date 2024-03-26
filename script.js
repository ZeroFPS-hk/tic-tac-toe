const gameboard = (function(){
    const boardRows = 3;
    const boardColumns = 3;
    const board = [];
    for(let i=0; i<boardRows; i++){
        board[i] = [];
        for(let j=0; j<boardColumns; j++){
            board[i][j] = createCell();
        }
    }

    const getBoard = () => board;
    const makeMove = (row, column, player) => {
        if(row >= boardRows || column >= boardColumns) return false; //cell doesn't exist
        if(board[row][column].getValue()) return false; //cell already filled
        board[row][column].setValue(player);
        return true;
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    };

    return{getBoard, makeMove, printBoard};
})();

function createCell(){
    let value = "";
    const getValue = () => value;
    const setValue = (player) => {value = value || player;}
    return{getValue, setValue};
}

const gameController = (function(){

    return{};
})();