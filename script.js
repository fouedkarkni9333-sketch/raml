const translations = {
    en: {
        title: "RAML",
        mode2: "2 Players",
        mode3: "3 Players",
        mode4: "4 Players",
        reset: "Reset Game",
        turnWhite: "Turn (White)",
        turnBlack: "Turn (Black)",
        botTurn: "Bot's Turn (Black)",
        winMsg: "Congratulations!",
        nextMatchBtn: "Start Grand Final!",
        playAgainBtn: "Play Again",
        champMsg: "is the Grand Champion of RAML!",
        splitNotice3: "Split Screen: P1 vs P2 (Top) | P3 vs Bot (Bottom)",
        splitNotice4: "Split Screen: P1 vs P2 (Top) | P3 vs P4 (Bottom)",
        finalNotice: "Grand Final Match",
        winner: "Winner:"
    },
    ar: {
        title: "لعبة الرمل (RAML)",
        mode2: "لاعبان",
        mode3: "3 لاعبين",
        mode4: "4 لاعبين",
        reset: "إعادة اللعبة",
        turnWhite: "دور (الأبيض)",
        turnBlack: "دور (الأسود)",
        botTurn: "دور الروبوت (الأسود)",
        winMsg: "مبروك الفوز!",
        nextMatchBtn: "ابدأ النهائي الكبير!",
        playAgainBtn: "اللعب من جديد",
        champMsg: "هو البطل النهائي للعبة الرمل!",
        splitNotice3: "شاشة مقسمة: (اللاعب 1 ضد 2) أعلى | (اللاعب 3 ضد الروبوت) أسفل",
        splitNotice4: "شاشة مقسمة: (اللاعب 1 ضد 2) أعلى | (اللاعب 3 ضد 4) أسفل",
        finalNotice: "مباراة النهائي الكبير",
        winner: "الفائز:"
    },
    fr: {
        title: "RAML - Jeu de Sable",
        mode2: "2 Joueurs",
        mode3: "3 Joueurs",
        mode4: "4 Joueurs",
        reset: "Réinitialiser",
        turnWhite: "Tour (Blanc)",
        turnBlack: "Tour (Noir)",
        botTurn: "Tour du Bot (Noir)",
        winMsg: "Félicitations!",
        nextMatchBtn: "Grande Finale!",
        playAgainBtn: "Rejouer",
        champMsg: "est le Grand Champion de RAML!",
        splitNotice3: "Écran partagé: P1 vs P2 (Haut) | P3 vs Bot (Bas)",
        splitNotice4: "Écran partagé: P1 vs P2 (Haut) | P3 vs P4 (Bas)",
        finalNotice: "Grande Finale",
        winner: "Gagnant:"
    }
};

let currentLang = 'en';

const WINNING_COMBOS = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]          
];

// حالات الرقعتين (Board 1 و Board 2)
let gameMode = 2; // 2, 3, or 4
let isFinalStage = false; // هل وصلنا للنهائي الموحد؟

let boards = {
    1: {
        state: Array(9).fill(null),
        currentPlayer: 1,
        piecesPlaced: { 1: 0, 2: 0 },
        selectedPoint: null,
        p1: "Player 1",
        p2: "Player 2",
        isBot: false,
        winner: null
    },
    2: {
        state: Array(9).fill(null),
        currentPlayer: 1,
        piecesPlaced: { 1: 0, 2: 0 },
        selectedPoint: null,
        p1: "Player 3",
        p2: "Player 4",
        isBot: false,
        winner: null
    }
};

window.onload = () => {
    updateLanguage();
};

function changeLanguage(lang) {
    currentLang = lang;
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
    updateLanguage();
}

function updateLanguage() {
    const t = translations[currentLang];
    document.getElementById('title-text').innerText = t.title;
    document.getElementById('mode-2-btn').innerText = t.mode2;
    document.getElementById('mode-3-btn').innerText = t.mode3;
    document.getElementById('mode-4-btn').innerText = t.mode4;
    document.getElementById('reset-btn').innerText = t.reset;
    setupGameMode();
}

function setMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}-btn`).classList.add('active');
    resetFullGame();
}

function resetFullGame() {
    isFinalStage = false;
    setupGameMode();
}

function setupGameMode() {
    const t = translations[currentLang];
    const wrapper = document.getElementById('boards-wrapper');
    const pane2 = document.getElementById('pane-2');
    const info = document.getElementById('tournament-info');

    // إعداد أسماء اللاعبين حسب الأوضاع
    if (gameMode === 2) {
        wrapper.className = "boards-wrapper single-board-mode";
        pane2.style.display = "none";
        info.innerText = "";
        
        boards[1].p1 = currentLang === 'ar' ? "اللاعب 1" : "Player 1";
        boards[1].p2 = currentLang === 'ar' ? "اللاعب 2" : "Player 2";
        boards[1].isBot = false;
        resetBoard(1);
    } 
    else if (gameMode === 3) {
        if (!isFinalStage) {
            wrapper.className = "boards-wrapper split-board-mode";
            pane2.style.display = "block";
            info.innerText = t.splitNotice3;

            boards[1].p1 = currentLang === 'ar' ? "اللاعب 1" : "Player 1";
            boards[1].p2 = currentLang === 'ar' ? "اللاعب 2" : "Player 2";
            boards[1].isBot = false;
            resetBoard(1);

            boards[2].p1 = currentLang === 'ar' ? "اللاعب 3" : "Player 3";
            boards[2].p2 = currentLang === 'ar' ? "الروبوت" : "Bot";
            boards[2].isBot = true;
            resetBoard(2);
        } else {
            // مرحلة النهائي المشترك بين رابح رقعة 1 ورابح رقعة 2
            wrapper.className = "boards-wrapper single-board-mode";
            pane2.style.display = "none";
            info.innerText = t.finalNotice;

            boards[1].p1 = boards[1].winner || "Player 1";
            boards[1].p2 = boards[2].winner || "Player 2";
            boards[1].isBot = false;
            resetBoard(1);
        }
    } 
    else if (gameMode === 4) {
        if (!isFinalStage) {
            wrapper.className = "boards-wrapper split-board-mode";
            pane2.style.display = "block";
            info.innerText = t.splitNotice4;

            boards[1].p1 = currentLang === 'ar' ? "اللاعب 1" : "Player 1";
            boards[1].p2 = currentLang === 'ar' ? "اللاعب 2" : "Player 2";
            boards[1].isBot = false;
            resetBoard(1);

            boards[2].p1 = currentLang === 'ar' ? "اللاعب 3" : "Player 3";
            boards[2].p2 = currentLang === 'ar' ? "اللاعب 4" : "Player 4";
            boards[2].isBot = false;
            resetBoard(2);
        } else {
            // مرحلة النهائي المشترك
            wrapper.className = "boards-wrapper single-board-mode";
            pane2.style.display = "none";
            info.innerText = t.finalNotice;

            boards[1].p1 = boards[1].winner || "Player 1";
            boards[1].p2 = boards[2].winner || "Player 3";
            boards[1].isBot = false;
            resetBoard(1);
        }
    }
}

function resetBoard(boardId) {
    let b = boards[boardId];
    b.state = Array(9).fill(null);
    b.currentPlayer = 1;
    b.piecesPlaced = { 1: 0, 2: 0 };
    b.selectedPoint = null;
    b.winner = null;
    renderBoard(boardId);
    updateStatusText(boardId);
    document.getElementById('win-modal').style.display = 'none';
}

function updateStatusText(boardId) {
    let b = boards[boardId];
    let t = translations[currentLang];
    let statusEl = document.getElementById(`game-status-${boardId}`);
    
    if (b.isBot && b.currentPlayer === 2) {
        statusEl.innerText = `${b.p2} : ${t.botTurn}`;
    } else {
        let name = b.currentPlayer === 1 ? b.p1 : b.p2;
        let turnStr = b.currentPlayer === 1 ? t.turnWhite : t.turnBlack;
        statusEl.innerText = `${name} : ${turnStr}`;
    }
}

function renderBoard(boardId) {
    let b = boards[boardId];
    for (let i = 0; i < 9; i++) {
        let pt = document.querySelector(`.point[data-board='${boardId}'][data-index='${i}']`);
        if (!pt) continue;
        pt.className = 'point';
        if (b.state[i] === 1) pt.classList.add('p1');
        if (b.state[i] === 2) pt.classList.add('p2');
        if (b.selectedPoint === i) pt.classList.add('selected');
    }
}

// الحركة المرنة بالكامل وبكل سلاسة كما طلبت تماماً
function handlePointClick(boardId, index) {
    let b = boards[boardId];
    if (b.isBot && b.currentPlayer === 2) return;

    // Phase 1: Placing pieces
    if (b.piecesPlaced[1] < 3 || b.piecesPlaced[2] < 3) {
        if (b.piecesPlaced[b.currentPlayer] < 3 && b.state[index] === null) {
            b.state[index] = b.currentPlayer;
            b.piecesPlaced[b.currentPlayer]++;
            if (checkWin(b.state, b.currentPlayer)) {
                handleBoardWin(boardId, b.currentPlayer);
                return;
            }
            switchTurn(boardId);
        }
    } 
    // Phase 2: Moving pieces anywhere freely
    else {
        if (b.selectedPoint === null) {
            if (b.state[index] === b.currentPlayer) {
                b.selectedPoint = index;
            }
        } else {
            if (index === b.selectedPoint) {
                b.selectedPoint = null;
            } else if (b.state[index] === null) {
                b.state[b.selectedPoint] = null;
                b.state[index] = b.currentPlayer;
                b.selectedPoint = null;
                if (checkWin(b.state, b.currentPlayer)) {
                    handleBoardWin(boardId, b.currentPlayer);
                    return;
                }
                switchTurn(boardId);
            } else if (b.state[index] === b.currentPlayer) {
                b.selectedPoint = index;
            }
        }
    }
    renderBoard(boardId);
}

function switchTurn(boardId) {
    let b = boards[boardId];
    b.currentPlayer = b.currentPlayer === 1 ? 2 : 1;
    updateStatusText(boardId);
    renderBoard(boardId);

    if (b.isBot && b.currentPlayer === 2) {
        setTimeout(() => makeBotMove(boardId), 500);
    }
}

function makeBotMove(boardId) {
    let b = boards[boardId];
    if (b.piecesPlaced[2] < 3) {
        let move = getBestPlacementIndex(b.state);
        b.state[move] = 2;
        b.piecesPlaced[2]++;
        if (checkWin(b.state, 2)) {
            handleBoardWin(boardId, 2);
            return;
        }
    } else {
        let move = getBestMovementMove(b.state);
        if (move) {
            b.state[move.from] = null;
            b.state[move.to] = 2;
            if (checkWin(b.state, 2)) {
                handleBoardWin(boardId, 2);
                return;
            }
        }
    }
    switchTurn(boardId);
}

function getBestPlacementIndex(state) {
    for (let i = 0; i < 9; i++) {
        if (state[i] === null) {
            state[i] = 2;
            if (checkWin(state, 2)) { state[i] = null; return i; }
            state[i] = null;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (state[i] === null) {
            state[i] = 1;
            if (checkWin(state, 1)) { state[i] = null; return i; }
            state[i] = null;
        }
    }
    if (state[4] === null) return 4;
    const empties = state.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return empties[Math.floor(Math.random() * empties.length)];
}

function getBestMovementMove(state) {
    let myPieces = state.map((val, idx) => val === 2 ? idx : null).filter(val => val !== null);
    let validEmpties = state.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (myPieces.length > 0 && validEmpties.length > 0) {
        let from = myPieces[Math.floor(Math.random() * myPieces.length)];
        let to = validEmpties[Math.floor(Math.random() * validEmpties.length)];
        return { from, to };
    }
    return null;
}

function checkWin(state, player) {
    return WINNING_COMBOS.some(combo => combo.every(idx => state[idx] === player));
}

function handleBoardWin(boardId, winnerPlayer) {
    let b = boards[boardId];
    renderBoard(boardId);
    b.winner = winnerPlayer === 1 ? b.p1 : b.p2;

    if (gameMode === 2 || isFinalStage) {
        // الفائز النهائي باللعبة
        showWinModal(b.winner, true);
    } else {
        // في وضع 3 أو 4 لاعبين، الرقعة الحالية انتهت. نتحقق هل انتهت الرقعتان معاً؟
        if (gameMode === 3) {
            // الرقعة 1 تنتهي بفائز، والرقعة 2 تنتهي بفائز (أو الروبوت)
            if (boards[1].winner && boards[2].winner) {
                showWinModal(`انتهت مرحلة التصفية! الفائزون هم: ${boards[1].winner} و ${boards[2].winner}`, false);
            }
        } else if (gameMode === 4) {
            if (boards[1].winner && boards[2].winner) {
                showWinModal(`انتهت مرحلة النصف نهائي! الفائزون هم: ${boards[1].winner} و ${boards[2].winner}`, false);
            }
        }
    }
}

function showWinModal(msg, isGrandChamp) {
    const t = translations[currentLang];
    const modal = document.getElementById('win-modal');
    const winnerText = document.getElementById('winner-text');
    const winnerSubtext = document.getElementById('winner-subtext');
    const nextBtn = document.getElementById('modal-next-btn');

    winnerText.innerText = `${t.winMsg} 🎉`;
    winnerSubtext.innerText = isGrandChamp ? `${msg} ${t.champMsg}` : msg;
    nextBtn.innerText = isGrandChamp ? t.playAgainBtn : t.nextMatchBtn;
    modal.style.display = 'flex';
}

function nextTournamentStep() {
    document.getElementById('win-modal').style.display = 'none';

    if (gameMode === 2 || isFinalStage) {
        resetFullGame();
    } else {
        // الانتقال للنهائي المشترك بشاشة واحدة موحدة
        isFinalStage = true;
        setupGameMode();
    }
}
