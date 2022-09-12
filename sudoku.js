
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
        let number = document.createElement("div");
        number.id = i
        number.innerText = i;
        number.classList.add("number");
        document.getElementById("numberBar").appendChild(number);
    }
}


