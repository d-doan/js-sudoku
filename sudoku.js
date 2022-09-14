
var errors = 0;

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
    "000000010",
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
        if (solutionBoard[x][y] != selectedNum.innerText &&
            this.innerText != selectedNum.innerText) {
            errors += 1;
            document.getElementById("errors").innerText = errors;
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
