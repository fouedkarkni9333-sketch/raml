const boardElement = document.getElementById('board');
const statusElement = document.getElementById('game-status');

let boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayer = 1; // 1 للأبيض، 2 للأسود
let isGameActive = true;
let totalMoves = 0;

// مولد صوت الحصى على الرمل باستخدام Web Audio API
function playSandSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        // إنشاء ضوضاء بيضاء تشبه صوت احتكاك الحبيبات (الرمل/الحصى)
        const bufferSize = audioCtx.sampleRate * 0.08; // مدة قصيرة جداً (80 جزء من الألف من الثانية)
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        // فلتر لضبط نبرة الصوت لتكون خشنة وعميقة تشبه الحصى
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 800; // تردد يناسب صوت الاصطدام الخفيف
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

        node.addEventListener('click', () => handleNodeClick(index));
        boardElement.appendChild(node);
    });
}

function handleNodeClick(index) {
    if (!isGameActive || boardState[index] !== 0) return;

    // تشغيل صوت الحصى فور النقر ووضع الحجر
    playSandSound();

    boardState[index] = currentPlayer;
    totalMoves++;

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

    currentPlayer = currentPlayer === 1 ? 2 : 1;
    statusElement.innerText = currentPlayer === 1 ? "دور اللاعب الأول (الأبيض)" : "دور اللاعب الثاني (الأسود)";

    createBoard();
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

function resetGame() {
    boardState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    currentPlayer = 1;
    isGameActive = true;
    totalMoves = 0;
    statusElement.innerText = "دور اللاعب الأول (الأبيض)";
    createBoard();
}

createBoard();
