const boardElement = document.getElementById('board');
const gameStatus = document.getElementById('game-status');
const winModal = document.getElementById('win-modal');
const winnerText = document.getElementById('winner-text');

// إحداثيات النقاط 9 على الرقعة (بنسب مئوية)
const nodePositions = [
    { top: '10%', left: '10%' }, { top: '10%', left: '50%' }, { top: '10%', left: '90%' },
    { top: '50%', left: '10%' }, { top: '50%', left: '50%' }, { top: '50%', left: '90%' },
    { top: '90%', left: '10%' }, { top: '90%', left: '50%' }, { top: '90%', left: '90%' }
];

// العقد المجاورة المسموح بالانتقال إليها لكل عقدة
const adjacencies = {
    0: [1, 3, 4],
    1: [0, 2, 4],
    2: [1, 5, 4],
    3: [0, 6, 4],
    4: [0, 1, 2, 3, 5, 6, 7, 8], // النقطة الوسطى تتصل بكل النقاط
    5: [2, 8, 4],
    6: [3, 7, 4],
    7: [6, 8, 4],
    8: [5, 7, 4]
};

// طرق الفوز (3 نقاط على خط واحد)
const winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // صفوف افقية
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // أعمدة رأسية
    [0, 4, 8], [2, 4, 6]             // أقطار
];

let boardState = Array(9).fill(null); // null, 'white', 'black'
let currentPlayer = 'white'; // 'white' أو 'black'
let selectedNode = null;
let gamePhase = 'drop'; // مرحلة وضع القطع 'drop' ثم مرحلة التحريك 'move'
let piecesDropped = { white: 0, black: 0 };

function initBoard() {
    boardElement.innerHTML = '';
    boardState = Array(9).fill(null);
    currentPlayer = 'white';
    selectedNode = null;
    gamePhase = 'drop';
    piecesDropped = { white: 0, black: 0 };
    winModal.style.display = 'none';
    updateStatus();

    nodePositions.forEach((pos, index) => {
        const node = document.createElement('div');
        node.className = 'node';
        node.style.top = pos.top;
        node.style.left = pos.left;
        node.dataset.index = index;
        node.addEventListener('click', () => handleNodeClick(index));
        boardElement.appendChild(node);
    });
}

function handleNodeClick(index) {
    if (gamePhase === 'drop') {
        // مرحلة وضع القطع الـ 3 الأولى لكل لاعب
        if (boardState[index] === null) {
            boardState[index] = currentPlayer;
            piecesDropped[currentPlayer]++;
            
            if (piecesDropped.white === 3 && piecesDropped.black === 3) {
                gamePhase = 'move';
            }
            
            if (checkWin(currentPlayer)) {
                endGame(currentPlayer);
                return;
            }

            switchPlayer();
        }
    } else if (gamePhase === 'move') {
        // مرحلة تحريك القطع
        if (selectedNode === null) {
            if (boardState[index] === currentPlayer) {
                selectedNode = index;
            }
        } else {
            if (index === selectedNode) {
                selectedNode = null; // إلغاء التحديد
            } else if (boardState[index] === null && adjacencies[selectedNode].includes(index)) {
                // نقل قطعة إلى مكان مجاور فارغ
                boardState[selectedNode] = null;
                boardState[index] = currentPlayer;
                selectedNode = null;

                if (checkWin(currentPlayer)) {
                    renderBoard();
                    endGame(currentPlayer);
                    return;
                }

                switchPlayer();
            }
        }
    }
    renderBoard();
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
    updateStatus();
}

function updateStatus() {
    const name = currentPlayer === 'white' ? 'الأول (الأبيض)' : 'الثاني (الأسود)';
    if (gamePhase === 'drop') {
        gameStatus.innerText = `دور اللاعب ${name} - ضع قطعة`;
    } else {
        gameStatus.innerText = `دور اللاعب ${name} - حرك قطعة`;
    }
}

function renderBoard() {
    const nodes = boardElement.querySelectorAll('.node');
    nodes.forEach((node, index) => {
        node.innerHTML = '';
        node.classList.remove('selected');

        if (boardState[index]) {
            const piece = document.createElement('div');
            piece.className = `piece ${boardState[index]}`;
            node.appendChild(piece);
        }

        if (selectedNode === index) {
            node.classList.add('selected');
        }
    });
}

function checkWin(player) {
    return winLines.some(line => {
        return line.every(index => boardState[index] === player);
    });
}

function endGame(winner) {
    const winnerName = winner === 'white' ? 'اللاعب الأول (الأبيض)' : 'اللاعب الثاني (الأسود)';
    winnerText.innerText = `مبروك! فوز ${winnerName}`;
    winModal.style.display = 'flex';
}

function resetGame() {
    initBoard();
}

// تشغيل اللعبة عند التحميل
initBoard();
