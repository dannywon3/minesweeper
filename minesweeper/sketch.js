function make2DArray(cols, rows) {
    var arr = new Array(cols);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
    }
    return arr;
}

var grid;
var cols;
var rows;
var w = 20;

var totalMines = 99;

function setup() {
    // 601, 321 & 99 bombs -> expert mode
    // 321, 321 & 40 bombs -> intermediate mode
    // 180, 180 & 10 bombs -> beginner mode
    createCanvas(601, 321);
    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Cell(i, j, w);
        }
    }


    // pick totalMines spots
    var options = [];
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            options.push([i,j]);
        }
    }


    for (var n = 0; n < totalMines; n++) {
        var index = floor(random(options.length));
        var choice = options[index];
        var i = choice[0];
        var j = choice[1];
        // delete that spot so it is no longer an option
        options.splice(index, 1);
        grid[i][j].mine = true;
    }




    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].countMines();
        }
    }
}

function gameOver() {
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].revealed = true;
        }
    }
}

function mousePressed() {
    background(255);
    if (mouseButton === LEFT) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                if (grid[i][j].contains(mouseX, mouseY) && !grid[i][j].flagged) {
                    grid[i][j].reveal();

                    if (grid[i][j].mine) {
                        gameOver();
                    }
                }
            }
        }
    } else if (mouseButton === RIGHT) {
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                if (grid[i][j].contains(mouseX, mouseY)) {
                    grid[i][j].flag();
                }
            }
        }
    }
}


function draw() {
    background(255);
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show();
        }
    }

    let gameLoseFlag = false;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].revealed) {
                gameLoseFlag = true;
            } else {
                gameLoseFlag = false;
                break;
            }
        }
    }

    let gameWinFlag = false;
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (grid[i][j].mine && grid[i][j].flagged) {
                gameWinFlag = true;
            } else if (grid[i][j].mine && !grid[i][j].flagged) {
                gameWinFlag = false;
                break;
            }
        }
    }
    

    if (gameLoseFlag) {
        push();
        textSize(50);
        stroke(0);
        fill(0);
        text("Ruh Roh, you lose", width / 2, height / 2);
        pop();
    } else if (gameWinFlag) {
        push();
        textSize(50);
        stroke(0);
        fill(0);
        text("Woohoo, you win", width / 2, height / 2);
        pop();
    }


}
