const boardElement = document.getElementById('board');
const statusElement = document.getElementById('game-status');
const winModal = document.getElementById('win-modal');
const winnerText = document.getElementById('winner-text');

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayer = 1; // 1 للأبيض، 2 للأسود
let isGameActive = true;
let selectedPieceIndex = null;

let whitePiecesPlaced = 0;
let blackPiecesPlaced = 0;
const maxPiecesPerPlayer = 3;

// مولد صوت احتكاك الحصى على الرمل
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
        const isWhiteTurn = currentPlayer === 1;

        if (boardState[index] !== 0) return; // الخانة مشغولة

        playSandSound();
        boardState[index] = currentPlayer;

        if (isWhiteTurn) {
            whitePiecesPlaced++;
        } else {
            blackPiecesPlaced++;
        }

        // إمكانية المحاصرة حتى أثناء الوضع
        checkAndRemoveCapturedPieces(index, currentPlayer);

        if (checkWin(currentPlayer)) {
            endGame(currentPlayer);
            return;
        }

        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateStatus();
        createBoard();
        return;
    }

    // --- المرحلة الثانية: تحريك الأحجار والمحاصرة ---
    const isWhiteTurn = currentPlayer === 1;
    const playerPieceValue = isWhiteTurn ? 1 : 2;

    if (selectedPieceIndex === null) {
        // تحديد الحجر المراد تحريكه
        if (boardState[index] === playerPieceValue) {
            selectedPieceIndex = index;
            playSandSound();
            createBoard();
        }
    } else {
        // نقل الحجر إلى مكان فارغ
        if (boardState[index] === 0) {
            playSandSound();
            boardState[selectedPieceIndex] = 0; // تفريغ المكان القديم
            boardState[index] = playerPieceValue; // وضع الحجر في المكان الجديد
            selectedPieceIndex = null;

            // تنفيذ فحص المحاصرة والأكل عند الاستقرار في المكان الجديد
            checkAndRemoveCapturedPieces(index, currentPlayer);

            if (checkWin(currentPlayer)) {
                endGame(currentPlayer);
                return;
            }

            currentPlayer = currentPlayer === 1 ? 2 : 1;
            updateStatus();
            createBoard();
        } else if (boardState[index] === playerPieceValue) {
            // تغيير الحجر المختار
            selectedPieceIndex = index;
            createBoard();
        }
    }
}

// دالة فحص محاصرة قطعة الخصم (أكل
