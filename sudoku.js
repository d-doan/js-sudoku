
var errors = 0;
var totErr = 0;

var selectedNum;
var squareSelected;
const numbers = document.querySelector('.number');

// . represents empty space
// each string represents a 3x3 tile
var board = [
    "123456789",
    "0000000.0",
    "987654321",
    "MATTHEWSU",
    "ABCDEFGHI",
    "POKEMONGO",
    ".....1111",
    "8008135HA",
    "KILLMEPLS"
]

// holds solution board
var solutionBoard = [
    "123456789",
    "0000000.0",
    "987654321",
    "MATTHEWSU",
    "ABCDEFGHI",
    "POKEMONGO",
    ".....1111",
    "8008135HA",
    "KILLMEPLS"
]

// Loades initial board upon window open
window.onload = function () {
    createGame();
}

function createGame() {
    // Display number of errors when check button is pressed
    let check = document.createElement("button");
    check.innerText = "Check Board";
    check.addEventListener('click', checkError);
    document.getElementById("check").appendChild(check);
    // create starting sudoku board
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
                square.error = false;
            }
            else {
                square.innerText = board[i - 1][j - 1];
                square.readOnly = true;
            }
        }
    }

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

        // Error case: mark square as an error and increment error
        if (solutionBoard[x][y] != selectedNum.innerText &&
            this.innerText != selectedNum.innerText) {
            totErr += 1;
            if (this.error == false) {
                errors += 1;
            }
            this.error = true;
        }

        // Correct case: mark square as correct and decrement error
        if (solutionBoard[x][y] == selectedNum.innerText &&
            this.innerText != selectedNum.innerText &&
            this.error == true) {
            errors -= 1;
            this.error = false;
        }
        this.innerText = selectedNum.innerText;
        updateBoard(selectedNum.innerText, x, y);
    }
}

// Allows update on strings in Board bc strings are read only
function updateBoard(num, x, y) {
    let boardArr = board[x].split("");
    boardArr[y] = num;
    board[x] = boardArr.join("");
}

function checkError() {
    document.getElementById("errText").innerHTML = "Errors: " + errors +
    "<br></br>Total Errors Made: " + totErr;
    if (JSON.stringify(board) == JSON.stringify(solutionBoard)) {
        document.getElementById("errText").innerText = "No errors, congrats!"; //make text green
    }
    document.getElementById("errOverlay").style.display = "block";
}

function off() {
    document.getElementById("errOverlay").style.display = "none";
}

function generateFirstBoard() {
    let choices = [1,2,3,4,5,6,7,8,9];

    // Fisher-Yates algorithm to shuffle array
    for (let i = choices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = choices[i];
        choices[i] = choices[j];
        choices[j] = temp;
    }
    choices = choices.toString();    
    return choices.replaceAll(',', '');;
}

function generateBoards() {

}

function validGrid(grid, num) {
    return !(grid.includes(num));
}

function validCol(gridId, tileId, num) {
    let gridCol = gridId % 3;
    let tileCol = tileId % 3;
    let invalNums = "";
    for (i = gridCol; i < 9; i += 3) {
        for (j = tileCol; j < 9; j += 3) {
            invalNums += solutionBoard[i][j];
        }
    }
    return !(invalNums.includes(num));
}

function validRow(gridId, tileId, num) {
    let gridRow = Math.floor(gridId/3) * 3;
    let tileRow = Math.floor(tileId/3) * 3;
    let invalNums = "";
    for (i = 0; i < 3; i++) {
        invalNums += solutionBoard[gridRow].substring(tileRow, tileRow + 3);
    }
    return !(invalNums.includes(num));
}

//console.log(validGrid("234567891",1));

console.log(validCol(2,0,9));