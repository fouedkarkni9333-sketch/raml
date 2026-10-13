const boardElement = document.getElementById('board');
const statusElement = document.getElementById('game-status');

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // 9 خانات للشبكة
let currentPlayer = 1; // 1 للأبيض، 2 للأسود
let isGameActive = true;
let totalMoves = 0;

function createBoard() {
    boardElement.innerHTML = '';
    boardState.forEach((cell, index) => {
        const node = document.createElement('div');
        node.classList.add('node');
        
        if (cell === 1) node.classList.add('piece-1');
        if (cell === 2) node.classList.add('piece-2');

        node.addEventListener('click', () => handleNodeClick(index));
        boardElement.appendChild(node);
    });
}

function handleNodeClick(index) {
    if (!isGameActive || boardState[index] !== 0) return;

    // وضع الحجر في الخانة المطلوبة
    boardState[index] = currentPlayer;
    totalMoves++;

    // التحقق البسيط من الفوز (أو اكتمال المرحلة الأولى)
    if (checkWin(currentPlayer)) {
        statusElement.innerText = `🎉 فاز اللاعب ${currentPlayer === 1 ? 'الأول (الأبيض)' : 'الثاني (الأسود)'}!`;
        isGameActive = false;
        createBoard();
        return;
    }

    if (totalMoves === 9) {
        statusElement.innerText = "انتهت الجولة تعادلاً! اضغط إعادة اللعبة.";
        isGameActive = false;
        createBoard();
        return;
    }

    // تبديل الدور
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    statusElement.innerText = currentPlayer === 1 ? "دور اللاعب الأول (الأبيض)" : "دور اللاعب الثاني (الأسود)";

    createBoard();
}

function checkWin(player) {
    // خطوط الفوز التقليدية (3 متتالية أفقياً، عمودياً، أو قطرياً)
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // أفقياً
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // عمودياً
        [0, 4, 8], [2, 4, 6]            // قطرياً
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === player);
    });
}

function resetGame() {
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    currentPlayer = 1;
    isGameActive = true;
    totalMoves = 0;
    statusElement.innerText = "دور اللاعب الأول (الأبيض)";
    createBoard();
}

// تشغيل اللوحة عند بدء التحميل
createBoard();
