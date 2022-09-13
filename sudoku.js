
var errors = 0;

var numSelected;
var squareSelected;


var board = [

]

var solutionBoard = [

]

window.onload = function () {
    createGame();
}

function createGame() {

    for (let i = 1; i < 10; i++) {
        let grid = document.createElement("div");
        grid.id = i;
        grid.classList.add("grid");
        document.getElementById("board").appendChild(grid);
        for (let j = 1; j < 10; j++) {
            let num = document.createElement("div");
            num.id = j;
            num.classList.add("box");
            grid.appendChild(num);
        }
    }
    
    for (let i = 1; i < 10; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.classList.add("number");
        document.getElementById("numberBar").appendChild(number);
    }
}


