function Cell(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.neighbourCount = 0;

    this.mine = false;
    this.revealed = false;
    this.flagged = false;
}

Cell.prototype.show = function() {
    stroke(0);
    noFill();
    rect(this.x, this.y, this.w, this.w);

    if (this.flagged) {
        fill('red');
        rect(this.x, this.y, this.w, this.w);
    } else {
        fill(255);
        rect(this.x, this.y, this.w, this.w);
    }

    if (this.revealed) {
        if (this.mine) {
            noFill();
            ellipse(this.x + this.w * 0.5, this.y + this.w * 0.5, this.w * 0.5)
        } else {
            fill(200);
            rect(this.x, this.y, this.w, this.w);
            if (this.neighbourCount > 0) {
                textAlign(CENTER);
                fill(0);
                text(this.neighbourCount, this.x + this.w * 0.5, this.y + this.w - 6);
            }
        }
    }
}

Cell.prototype.countMines = function() {
    if (this.mine) {
        this.neighbourCount = -1;
        return;
    }
    var total = 0;

    for (var xoff = -1; xoff <= 1; xoff++) {
        for (var yoff = -1; yoff <= 1; yoff++) {
            var i = this.i + xoff;
            var j = this.j + yoff;
            if (i > -1 && i < cols && j > -1 && j < rows) {
                var neighbour = grid[i][j];
                if (neighbour.mine) {
                    total++;
                }
            }
        }
    }
    this.neighbourCount = total;
}

Cell.prototype.contains = function(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
}

// removes menu coming up from right clicking
document.oncontextmenu = function() {
    return false;
}

Cell.prototype.flag = function() {
    if (!this.flagged) {
        this.flagged = true;
    } else {
        this.flagged = false;
    }
}

Cell.prototype.reveal = function() {
    if (this.flagged) {
        return;
    } else {
        this.revealed = true;
        if (this.neighbourCount == 0) {
            // flood fill?
            this.floodFill();
        }
    }
}

// clearing all tiles with no bombs
Cell.prototype.floodFill = function() {
    for (var xoff = -1; xoff <= 1; xoff++) {
        for (var yoff = -1; yoff <= 1; yoff++) {
            var i = this.i + xoff;
            var j = this.j + yoff;
            if (i > -1 && i < cols && j > -1 && j < rows) {
                var neighbour = grid[i][j];
                if (!neighbour.mine && !neighbour.revealed) {
                    neighbour.reveal();
                }
            }
        }
    }
}