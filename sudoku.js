var totErr = 0;

var selectedNum;
var squareSelected;
const numbers = document.querySelector('.number');

// . represents empty space
// each string represents a 3x3 tile
var board = [
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    "........."
]

var startingBoard;

var emptyBoard = [
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    "........."
]

// holds solution board
var solutionBoard = [
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    ".........",
    "........."
]

// Loades initial board upon window open
window.onload = function () {

}

function createGame(diff) {
    document.getElementById("difficultyList").style.display = "none";
    // Display number of errors when check button is pressed
    let check = document.createElement("button");
    check.innerText = "Check Board";
    check.id = "checkButton";
    check.addEventListener('click', checkError);
    document.getElementById("check").appendChild(check);
    // create starting sudoku board
    generateBoards();

    // removes specified number from solution board
    removeNums(77);

    let htmlBoard = document.createElement("div");
    let numBar = document.createElement("div");
    htmlBoard.id = "board";
    numBar.id = "numberBar";
    document.body.appendChild(htmlBoard);
    document.body.appendChild(numBar);

    for (let i = 1; i <= 9; i++) {
        let grid = document.createElement("div");
        grid.id = i;
        grid.classList.add("grid");
        document.getElementById("board").appendChild(grid);
        for (let j = 1; j <= 9; j++) {
            let square = document.createElement("div");
            square.id = "" + i + j;
            square.classList.add("square");
            square.addEventListener('click', replaceNum);
            grid.appendChild(square);
            if (board[i - 1][j - 1] == ".") {
                square.innerText = " ";
                square.readOnly = false;
                square.error = true;
            }
            else {
                square.innerText = solutionBoard[i - 1][j - 1];
                updateBoard(solutionBoard[i - 1][j - 1], board, i - 1, j - 1);
                square.readOnly = true;
            }
        }
    }
    startingBoard = [...board];

    // create number selection bar
    for (let i = 1; i < 10; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("numberBar").appendChild(number);
    }
}

// Handles selecting a number from number bar
function selectNumber() {
    if (selectedNum != null) {
        selectedNum.classList.remove("selected-number")
    }
    selectedNum = this;
    selectedNum.classList.add("selected-number");
}

// Replace board square with selected num
function replaceNum() {
    if (selectedNum && !(this.readOnly)) {
        let x = parseInt(this.id[0]) - 1;
        let y = parseInt(this.id[1]) - 1;
        this.error = true;
        this.innerText = selectedNum.innerText;
        this.style.color = "red";
        updateBoard(selectedNum.innerText, board, x, y);
    }
}

// Allows update on strings in Board bc strings are read only
function updateBoard(num, boardType, x, y) {
    let boardArr = boardType[x].split("");
    boardArr[y] = num;
    boardType[x] = boardArr.join("");
}

function checkError() {
    errors = 0;
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            errFlag = false;
            currentTile = document.getElementById('' + i + j);
            let gridIdx = i - 1;
            let tileIdx = j - 1;
            let val = board[gridIdx][tileIdx];
            if (val == '.') {
                continue;
            }
            updateBoard('x', board, gridIdx, tileIdx);

            if (!(validGrid(board[gridIdx], val) &&
                validCol(board, gridIdx, tileIdx, val) &&
                validRow(board, gridIdx, tileIdx, val))) {
                if (currentTile.error == true) {
                    totErr++;
                    errFlag = true;
                }
                currentTile.error = false;
            }
            updateBoard(val, board, gridIdx, tileIdx);
            if (errFlag == true) {
                errors++;
            }
        }
    }
    document.getElementById("errText").style.color = "red";
    document.getElementById("errText").innerHTML = "Errors: " + errors +
        "<br></br>Total Errors Made: " + totErr;
    if (JSON.stringify(board) == JSON.stringify(solutionBoard)) {
        document.getElementById("errText").style.color = "green";
        document.getElementById("errText").innerHTML = "No errors, congrats!" +
            "<br></br>Total Errors Made: " + totErr;
    }
    document.getElementById("errOverlay").style.display = "block";
}

function off() {
    document.getElementById("errOverlay").style.display = "none";
}

function generateBoards() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let count = 0;
            while (solutionBoard[i][j] == '.') {
                val = Math.floor(Math.random() * 9 + 1);
                count++;
                if (validGrid(solutionBoard[i], val) &&
                    validCol(solutionBoard, i, j, val) &&
                    validRow(solutionBoard, i, j, val)) {
                    updateBoard(val, solutionBoard, i, j);
                }
                if (count > 2000) {
                    for (k = 1; k < 9; k++) {
                        solutionBoard[k] = ".........";
                    }
                    j = -1;
                    i = 0;
                    break;
                }
            }
        }
    }
}

// Check number is not already in the grid
function validGrid(grid, num) {
    return !(grid.includes(num));
}

// Check number is not already in the column
function validCol(boardType, gridId, tileId, num) {
    let gridCol = gridId % 3;
    let tileCol = tileId % 3;
    let invalNums = "";
    for (let i = gridCol; i < 9; i += 3) {
        for (let j = tileCol; j < 9; j += 3) {
            invalNums += boardType[i][j];
        }
    }
    return !(invalNums.includes(num));
}

// Check number is not already in the row
function validRow(boardType, gridId, tileId, num) {
    let gridRow = Math.floor(gridId / 3) * 3;
    let tileRow = Math.floor(tileId / 3) * 3;
    let invalNums = "";
    for (let i = 0; i < 3; i++) {
        invalNums += boardType[gridRow + i].substring(tileRow, tileRow + 3);
    }
    return !(invalNums.includes(num));
}

// replaces all except numReplace spaces with blanks
function removeNums(numReplace) {
    while (numReplace > 0) {
        validSpot = false;
        while (!validSpot) {
            let gridNum = Math.floor(Math.random() * 9);
            let charIdx = Math.floor(Math.random() * 9);
            if (board[gridNum][charIdx] == '.') {
                updateBoard(' ', board, gridNum, charIdx);
                validSpot = true;
            }
        }
        numReplace--;
    }
}

// resets back to starting board
function resetBoard() {
    board = [...startingBoard];
    errors = 0;
    totErr = 0;
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            currentTile = document.getElementById('' + i + j);
            if (currentTile.readOnly == false) {
                updateBoard('.', board, i - 1, j - 1);
                currentTile.innerText = ' ';
                currentTile.error = false;
            }
        }
    }
}

// deletes html elements for board and numBar
function delGame() {
    board = [...emptyBoard];
    solutionBoard = [...emptyBoard];
    document.getElementById('board').remove();
    document.getElementById('numberBar').remove();
    document.getElementById("difficultyList").style.display = "block";
    errors = 0;
    totErr = 0;
    document.getElementById('checkButton').remove();
}
