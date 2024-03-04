const rows = 100;
const cols = 100;
const boardElement = document.getElementById('board');
let board = createBoard(rows, cols);
let intervalId = null;
let animationSpeed = 137.5;

function createBoard(rows, cols) {
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols).fill(false);
    }
    return arr;
}

function drawBoard() {
    boardElement.innerHTML = '';
    board.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell' + (cell ? ' alive' : '');
            cellElement.addEventListener('click', () => {
                board[rowIndex][colIndex] = !board[rowIndex][colIndex];
                cellElement.className = 'cell' + (board[rowIndex][colIndex] ? ' alive' : '');
            });
            boardElement.appendChild(cellElement);
        });
    });
}


function updateBoard() {
    let newBoard = createBoard(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const alive = board[i][j];
            const neighbors = countNeighbors(i, j);
            if (alive && (neighbors === 2 || neighbors === 3)) {
                newBoard[i][j] = true;
            } else if (!alive && neighbors === 3) {
                newBoard[i][j] = true;
            }
        }
    }
    board = newBoard;
    drawBoard();
}

function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol]) {
                count++;
            }
        }
    }
    return count;
}

document.getElementById('nextGeneration').addEventListener('click', updateBoard);

document.getElementById('autoGeneration').addEventListener('click', function () {
    toggleAutoGeneration();
});

function toggleAutoGeneration() {
    autoGenerationButton = document.getElementById('autoGeneration');
    if (intervalId) {
        autoGenerationButton.textContent = 'Continuar';
        clearInterval(intervalId);
        intervalId = null;
    } else {
        autoGenerationButton.textContent = 'Pausar';
        intervalId = setInterval(updateBoard, animationSpeed);
    }
}

document.getElementById('resetBoard').addEventListener('click', resetBoard);

function resetBoard() {
    board = createBoard(rows, cols);
    drawBoard();
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    autoGenerationButton = document.getElementById('autoGeneration');
    autoGenerationButton.textContent = 'Iniciar/Pausar Automático';
}

simpleStart();

document.getElementById('randomBoard').addEventListener('click', randomBoard);

function randomBoard() {
    board = createBoard(rows, cols);
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            board[i][j] = Math.random() > 0.9;
        }
    }
    drawBoard();
}

document.getElementById('simpleStart').addEventListener('click', simpleStart);

function simpleStart() {
    board = createBoard(rows, cols);
    board[1][2] = true;
    board[2][3] = true;
    board[3][1] = true;
    board[3][2] = true;
    board[3][3] = true;
    drawBoard();
}

document.getElementById('speed').addEventListener('input', function () {
    animationSpeed = (1100 - this.value) / 4;
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = setInterval(updateBoard, animationSpeed);
    }
});

