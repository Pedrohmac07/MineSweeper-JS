var board = [];
var rows = 8;
var cols = 8;

var minesCount = 8;
var minesLocation = [];

var tilesClicked = 0; 
var flagEnabled = false;

var gameOver = false;

window.onload = function() {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;

    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)) {
            minesLocation.push(id)
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById("mines-count").innerText = minesCount;
    document.getElementById("flag-button").addEventListener("click", setFlag);
    document.getElementById("reset-button").addEventListener("click", restartPage)

    setMines();

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

    console.log(board);
}

function setFlag() {
    if (flagEnabled) {
        flagEnabled = false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }
    else {
        flagEnabled = true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}
function restartPage() {
    location.reload()
}

function clickTile() {
    if(gameOver || this.classList.contains("tile-cliked")) {
        return;
    }

    let tile = this;
    if (flagEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        revealMines();
        alert("Game Over! You clicked on a mine.");
        gameOver = true;
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    checkMine(r,c);
}

function revealMines () {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let tile = board[r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "darkgrey";
            }
        }
    }
}

function checkMine(r, c) {
    if ( r < 0 || r >= rows || c < 0 || c >= cols) {
        return;
    }
    if (board[r][c].classList.contains("tile-clicked")) {
        return;
    }

    board[r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    // top
    minesFound += checkTile(r-1, c-1); // top left
    minesFound += checkTile(r-1, c); // top
    minesFound += checkTile(r-1, c+1); // top right

    // sides
    minesFound += checkTile(r, c-1); // left
    minesFound += checkTile(r, c+1); // right

    // bottom
    minesFound += checkTile(r+1, c-1); // bottom left
    minesFound += checkTile(r+1, c); // bottom
    minesFound += checkTile(r+1, c+1); // bottom right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x" + minesFound.toString());
    }
    else {
        // top 
        checkMine(r-1, c-1); // top left
        checkMine(r-1, c); // top
        checkMine(r-1, c+1); // top right

        // sides
        checkMine(r, c-1); // left
        checkMine(r, c+1); // right

        // bottom
        checkMine(r+1, c-1); // bottom left
        checkMine(r+1, c); // bottom
        checkMine(r+1, c+1); // bottom right
    }

    if (tilesClicked == rows * cols - minesCount) {
        document.getElementById("mines-count").innerText = "cleared";
        gameOver = true
    }
}

function checkTile(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}