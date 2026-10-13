const boardElement = document.getElementById('board');
const gameStatus = document.getElementById('game-status');
const winModal = document.getElementById('win-modal');
const winnerText = document.getElementById('winner-text');

let boardState = Array(9).fill(null);
let currentPlayer = 'white';
let gameActive = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // أفقية
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // رأسية
    [0, 4, 8], [2, 4, 6]             // أقطار
];

function initGame() {
    boardElement.innerHTML = '';
    boardState = Array(9).fill(null);
    currentPlayer = 'white';
    gameActive = true;
    winModal.style.display = 'none';
    updateStatus();

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (boardState[index] !== null || !gameActive) return;

    boardState[index] = currentPlayer;
    renderBoard();

    if (checkWin(currentPlayer)) {
        gameActive = false;
        setTimeout(() => endGame(currentPlayer), 100);
        return;
    }

    if (boardState.every(cell => cell !== null)) {
        gameActive = false;
        gameStatus.innerText = 'تعادل!';
        return;
    }

    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateStatus();
}

function updateStatus() {
    if (currentPlayer === 'white') {
        gameStatus.innerText = 'دور: اللاعب الأول (الأبيض)';
    } else {
        gameStatus.innerText = 'دور: اللاعب الثاني (الأسود)';
    }
}

function renderBoard() {
    const cells = boardElement.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.innerHTML = '';
        if (boardState[index]) {
            const piece = document.createElement('div');
            piece.className = `piece ${boardState[index]}`;
            cell.appendChild(piece);
        }
    });
}

function checkWin(player) {
    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === player);
    });
}

function endGame(winner) {
    const winnerName = winner === 'white' ? 'اللاعب الأول (الأبيض)' : 'اللاعب الثاني (الأسود)';
    winnerText.innerText = `مبروك! فوز ${winnerName}`;
    winModal.style.display = 'flex';
}

function resetGame() {
    initGame();
}

initGame();
