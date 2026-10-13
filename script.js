const boardElement = document.getElementById('board');
const statusElement = document.getElementById('game-status');

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 9 نقاط كنموذج أولي للشبكة
let currentPlayer = 1; // 1 للأبيض، 2 للأسود
let isGameActive = true;

function createBoard() {
    boardElement.innerHTML = '';
    boardState.forEach((cell, index) => {
        const node = document.createElement('div');
        node.classList.add('node');
        node.dataset.index = index;
        
        if (cell === 1) node.classList.add('piece-1');
        if (cell === 2) node.classList.add('piece-2');

        node.addEventListener('click', () => handleNodeClick(index));
        boardElement.appendChild(node);
    });
}

function handleNodeClick(index) {
    if (!isGameActive || boardState[index] !== 0) return;

    boardState[index] = currentPlayer;
    
    // تبديل الدور
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    statusElement.innerText = currentPlayer === 1 ? "الدور: اللاعب الأول (الأبيض)" : "الدور: اللاعب الثاني (الأسود)";

    createBoard();
}

function resetGame() {
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    currentPlayer = 1;
    isGameActive = true;
    statusElement.innerText = "الدور: اللاعب الأول (الأبيض)";
    createBoard();
}

// تشغيل اللوحة عند فتح الصفحة
createBoard();
