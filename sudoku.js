var totErr = 0;
var selectedNum;
var squareSelected;

// flags for numBar buttons
let noteMode = false;
let eraseMode = false;

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

// used for reset button
var startingBoard;

// handle timer
var timerVar;
var totalSeconds;

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
    document.getElementById("difficultyList").style.display = "none";
}

// handles beginning elements
function start() {
    document.getElementById("difficultyList").style.display = "block";
    document.getElementById("start").style.display = "none";
}

// creates initial board and creates game buttons
function createGame(diff) {
    document.getElementById("difficultyList").style.display = "none";
    document.getElementById("gameControls").style.display = "block";
    // Display number of errors when check button is pressed
    let check = document.createElement("button");
    check.innerText = "Check Board";
    check.id = "checkButton";
    check.addEventListener("click", checkError);
    document.getElementById("check").appendChild(check);
    // create starting sudoku board
    generateBoards();

    // removes specified number from solution board
    removeNums(diff);

    // create timer
    let timer = document.createElement("div");
    timer.id = "timer";
    document.getElementById("gameControls").appendChild(timer);
    timerVar = setInterval(countTimer, 1000);
    totalSeconds = 0;

    // create board elements
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
            square.id = '' + i + j;
            square.classList.add("square");
            square.addEventListener("click", replaceNum);
            grid.appendChild(square);
            if (board[i - 1][j - 1] == '.') {
                square.innerText = ' ';
                square.readOnly = false;
                square.error = true;
                square.notes = false;
            }
            else {
                square.innerText = solutionBoard[i - 1][j - 1];
                updateBoard(solutionBoard[i - 1][j - 1], board, i - 1, j - 1);
                square.readOnly = true;
            }
        }
    }
    // copies board into startingBoard
    startingBoard = [...board];

    // create erase div at end of numberBar
    let erase = document.createElement("div");
    erase.classList.add("number");
    erase.innerText = "Erase";
    erase.id = "erase";
    erase.addEventListener("click", eraseNum);
    document.getElementById("numberBar").appendChild(erase);

    // create note div at end of numberBar
    let note = document.createElement("div");
    note.classList.add("number");
    note.innerText = "Note";
    note.id = "note";
    note.addEventListener("click", toggleNote);
    document.getElementById("numberBar").appendChild(note);

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
    document.getElementById("erase").classList.remove("selectedNumber");
    eraseMode = false;
    if (selectedNum != null) {
        selectedNum.classList.remove("selectedNumber")
    }
    selectedNum = this;
    selectedNum.classList.add("selectedNumber");
    for (let i = 1; i <= 9; i++) {
        for (let j = 1; j <= 9; j++) {
            curr = document.getElementById('' + i + j);
            curr.classList.remove("selectedNumber");
            if (curr.innerText == this.innerText) {
                curr.classList.add("selectedNumber");
            }
        }
    }
}

// Replace board square with selected num
function replaceNum() {
    // handles erasing numbers
    if (eraseMode == true && !this.readOnly) {
        if (this.notes == true) {
            let gridId = '' + this.id + 'g';
            document.getElementById(gridId).remove();
            this.notes = false;
        }
        let x = parseInt(this.id[0]) - 1;
        let y = parseInt(this.id[1]) - 1;
        this.innerText = ' ';
        updateBoard('.', board, x, y);
    }
    if (selectedNum && !(this.readOnly)) {
        if (noteMode == true) {
            if (this.notes == false) {
                this.innerText = '';
                let noteGrid = document.createElement("div");
                noteGrid.id = '' + this.id + 'g';
                noteGrid.classList.add("noteGrid");
                this.appendChild(noteGrid);
                for (let i = 1; i <= 9; i++) {
                    let note = document.createElement("div");
                    note.classList.add("squareNote");
                    note.id = '' + this.id + i;
                    noteGrid.appendChild(note);
                }
            }
            let noteId = '' + this.id + selectedNum.innerText;
            let noteTile = document.getElementById(noteId);
            if (noteTile.innerText != selectedNum.innerText) {
                noteTile.innerText = selectedNum.innerText;
            }
            this.notes = true;

        } else {
            if (this.notes == true) {
                let gridId = '' + this.id + 'g';
                let grid = document.getElementById(gridId);
                grid.remove();
                this.notes = false;
            }
            let x = parseInt(this.id[0]) - 1;
            let y = parseInt(this.id[1]) - 1;
            this.error = true;
            this.innerText = selectedNum.innerText;
            this.style.color = "red";
            this.classList.add("selectedNumber");
            updateBoard(selectedNum.innerText, board, x, y);

        }
    }
}

// Allows update on strings in Board bc strings are read only
function updateBoard(num, boardType, x, y) {
    let boardArr = boardType[x].split('');
    boardArr[y] = num;
    boardType[x] = boardArr.join('');
}

// checks for errors in current board
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
    // handles error checking screen
    document.getElementById("errText").style.color = "red";
    document.getElementById("errText").innerHTML = "Errors: " + errors +
        "<br></br>Total Errors Made: " + totErr;
    if (errors == 0 && checkFull(board)) {
        clearInterval(timerVar);
        document.getElementById("errText").style.color = "green";
        document.getElementById("errText").innerHTML = "No errors, congrats!" +
            "<br></br>Total Errors Made: " + totErr;
    }
    document.getElementById("errOverlay").style.display = "block";
}

function off() {
    document.getElementById("errOverlay").style.display = "none";
}

// generates valid sudoku board
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
    let invalNums = '';
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
    let invalNums = '';
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
    clearInterval(timerVar);
    document.getElementById('timer').remove();
    document.getElementById('gameControls').style.display = "none";
}

// checks board for empty tiles
function checkFull(boardType) {
    for (let i = 0; i < 9; i++) {
        if (boardType[i].includes('.')) {
            return false;
        }
    }
    return true;
}

// keeps track of and updates time
function countTimer() {
    ++totalSeconds;
    var hour = Math.floor(totalSeconds / 3600);
    var minute = Math.floor((totalSeconds - hour * 3600) / 60);
    var seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = '0' + hour;
    if (minute < 10)
        minute = '0' + minute;
    if (seconds < 10)
        seconds = '0' + seconds;
    document.getElementById("timer").innerHTML = hour + ':' + minute + ':' + seconds;
}

//determines if user is in note-taking mode
function toggleNote() {
    let noteKey = document.getElementById("note");
    if (eraseMode == true) {
        document.getElementById("erase").classList.remove("selectedNumber");
        eraseMode = false;
    }
    if (noteMode == false) {
        noteMode = true;
        noteKey.classList.add("selectedNumber");
    } else {
        noteMode = false;
        noteKey.classList.remove("selectedNumber");
    }
}

// handles erasing numbers on board
function eraseNum() {
    let eraseFlag = document.getElementById("erase");
    if (eraseMode == false) {
        if (selectedNum) {
            selectedNum.classList.remove("selectedNumber");
        }
        if (noteMode == true) {
            document.getElementById("note").classList.remove("selectedNumber");
            noteMode = false;
        }
        selectedNum = null;
        eraseMode = true;
        eraseFlag.classList.add("selectedNumber");
        for (let i = 1; i <= 9; i++) {
            for (let j = 1; j <= 9; j++) {
                curr = document.getElementById('' + i + j);
                curr.classList.remove("selectedNumber");
            }
        }
    } else {
        eraseMode = false;
        eraseFlag.classList.remove("selectedNumber");
    }
}
