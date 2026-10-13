const boardElement = document.getElementById('board');
const statusElement = document.getElementById('game-status');
const winModal = document.getElementById('win-modal');
const winnerText = document.getElementById('winner-text');

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayer = 1; // 1 للأبيض، 2 للأسود
let isGameActive = true;
let selectedPieceIndex = null; // لتخزين الحجر الذي تم اختياره للحركة

let whitePiecesPlaced = 0;
let blackPiecesPlaced = 0;
const maxPiecesPerPlayer = 3; // لكل لاعب 3 أحجار في المرحلة الثانية

// مولد صوت الحصى على الرمل
function playSandSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const bufferSize = audioCtx.sampleRate * 0.08;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 1.0;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        noise.start();
    } catch (e) {
        console.log("Audio not supported or blocked", e);
    }
}

function createBoard() {
    boardElement.innerHTML = '';
    boardState.forEach((cell, index) => {
        const node = document.createElement('div');
        node.classList.add('node');
        
        if (cell === 1) node.classList.add('piece-1');
        if (cell === 2) node.classList.add('piece-2');
        if (selectedPieceIndex === index) node.classList.add('selected');

        node.addEventListener('click', () => handleNodeClick(index));
        boardElement.appendChild(node);
    });
}

function handleNodeClick(index) {
    if (!isGameActive) return;

    const totalPlaced = whitePiecesPlaced + blackPiecesPlaced;

    // --- المرحلة الأولى: وضع الأحجار ---
    if (totalPlaced < maxPiecesPerPlayer * 2) {
        // يجب أن يكون دور اللاعب الحالي ووضع في خانة فارغة
        const isWhiteTurn = currentPlayer === 1;
        const isCurrentPlayerPiece = isWhiteTurn ? (whitePiecesPlaced < maxPiecesPerPlayer) : (blackPiecesPlaced < maxPiecesPerPlayer);

        if (boardState[index] !== 0) return; // الخانة مشغولة

        playSandSound();
        boardState[index] = currentPlayer;

        if (isWhiteTurn) {
            whitePiecesPlaced++;
        } else {
            blackPiecesPlaced++;
        }

        if (checkWin(currentPlayer)) {
            endGame(currentPlayer);
            return;
        }

        // تبديل الدور
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
        createBoard();
        return;
    }

    // --- المرحلة الثانية: تحريك الأحجار ---
    const isWhiteTurn = currentPlayer === 1;
    const playerPieceValue = isWhiteTurn ? 1 : 2;

    if (selectedPieceIndex === null) {
        // الخطوة أ: اختيار الحجر المراد تحريكه
        if (boardState[index] === playerPieceValue) {
            selectedPieceIndex = index;
            playSandSound();
            createBoard();
        }
    } else {
        // الخطوة ب: نقل الحجر المختار إلى خانة فارغة جديدة
        if (boardState[index] === 0) {
            playSandSound();
            boardState[selectedPieceIndex] = 0; // تفريغ المكان القديم
            boardState[index] = playerPieceValue; // وضع الحجر في المكان الجديد
            selectedPieceIndex = null; // إلغاء التحديد

            if (checkWin(currentPlayer)) {
                endGame(currentPlayer);
                return;
            }

            // تبديل الدور
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
            createBoard();
        } else if (boardState[index] === playerPieceValue) {
            // تغيير الحجر المحدد إذا نقر اللاعب على حجر آخر لنفسه
            selectedPieceIndex = index;
            createBoard();
        }
    }
}

function updateStatus() {
    const totalPlaced = whitePiecesPlaced + blackPiecesPlaced;
    if (totalPlaced < maxPiecesPerPlayer * 2) {
        statusElement.innerText = currentPlayer === 1 ? "مرحلة الوضع: دور الأبيض" : "مرحلة الوضع: دور الأسود";
    } else {
        statusElement.innerText = currentPlayer === 1 ? "مرحلة الحركة: دور الأبيض" : "مرحلة الحركة: دور الأسود";
    }
}

function checkWin(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // أفقياً
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // عمودياً
        [0, 4, 8], [2, 4, 6]            // قطرياً
    ];

    return winPatterns.some(pattern => {
        return pattern.every(index => boardState[index] === player);
    });
}

function endGame(player) {
    const winnerName = player === 1 ? 'اللاعب الأول (الأبيض)' : 'اللاعب الثاني (الأسود)';
    winnerText.innerText = `🎉 فاز ${winnerName}!`;
    winModal.style.display = 'flex';
    isGameActive = false;
    createBoard();
}

function resetGame() {
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    currentPlayer = 1;
    isGameActive = true;
    selectedPieceIndex = null;
    whitePiecesPlaced = 0;
    blackPiecesPlaced = 0;
    statusElement.innerText = "مرحلة الوضع: دور الأبيض";
    winModal.style.display = 'none';
    createBoard();
}

createBoard();
