// --- Translations Dictionary ---
const translations = {
    en: {
        title: "RAML",
        mode2: "2 Players",
        mode3: "3 Players",
        mode4: "4 Players",
        reset: "Reset Game",
        p1Turn: "Player 1's Turn (Red)",
        p2Turn: "Player 2's Turn (Teal)",
        p3Turn: "Player 3's Turn (Red)",
        p4Turn: "Player 4's Turn (Teal)",
        botTurn: "Bot's Turn (Teal)",
        winMsg: "Congratulations!",
        nextMatchBtn: "Next Match",
        playAgainBtn: "Play Again",
        champMsg: "is the Grand Champion of RAML!",
        stageSemi1: "Semi-Final 1: Player 1 vs Player 2",
        stageSemi2: "Semi-Final 2: Player 3 vs Player 4",
        stageSideBot: "Side Match: Player 3 vs Bot",
        stageFinal: "Final Match: ",
        winner: "Winner:"
    },
    ar: {
        title: "لعبة الرمل (RAML)",
        mode2: "لاعبان",
        mode3: "3 لاعبين",
        mode4: "4 لاعبين",
        reset: "إعادة اللعبة",
        p1Turn: "دور اللاعب 1 (الأحمر)",
        p2Turn: "دور اللاعب 2 (الأزرق)",
        p3Turn: "دور اللاعب 3 (الأحمر)",
        p4Turn: "دور اللاعب 4 (الأزرق)",
        botTurn: "دور الروبوت (الأزرق)",
        winMsg: "مبروك الفوز!",
        nextMatchBtn: "المباراة التالية",
        playAgainBtn: "اللعب من جديد",
        champMsg: "هو الفائز النهائي بالبطولة!",
        stageSemi1: "نصف النهائي 1: اللاعب 1 ضد اللاعب 2",
        stageSemi2: "نصف النهائي 2: اللاعب 3 ضد اللاعب 4",
        stageSideBot: "مباراة جانبية: اللاعب 3 ضد الروبوت",
        stageFinal: "المباراة النهائية: ",
        winner: "الفائز:"
    },
    fr: {
        title: "RAML - Jeu de Sable",
        mode2: "2 Joueurs",
        mode3: "3 Joueurs",
        mode4: "4 Joueurs",
        reset: "Réinitialiser",
        p1Turn: "Tour du Joueur 1 (Rouge)",
        p2Turn: "Tour du Joueur 2 (Teal)",
        p3Turn: "Tour du Joueur 3 (Rouge)",
        p4Turn: "Tour du Joueur 4 (Teal)",
        botTurn: "Tour du Bot (Teal)",
        winMsg: "Félicitations!",
        nextMatchBtn: "Match Suivant",
        playAgainBtn: "Rejouer",
        champMsg: "est le Grand Champion de RAML!",
        stageSemi1: "Demi-finale 1: Joueur 1 vs Joueur 2",
        stageSemi2: "Demi-finale 2: Joueur 3 vs Joueur 4",
        stageSideBot: "Match Parallèle: Joueur 3 vs Bot",
        stageFinal: "Grande Finale: ",
        winner: "Gagnant:"
    }
};

let currentLang = 'en';

// --- Board & Game Logic Variables ---
const WINNING_COMBOS = [
    [0,1,2], [3,4,5], [6,7,8], // Rows
    [0,3,6], [1,4,7], [2,5,8], // Columns
    [0,4,8], [2,4,6]          // Diagonals
];

const ADJACENCY = {
    0: [1, 3, 4],
    1: [0, 2, 4],
    2: [1, 5, 4],
    3: [0, 6, 4],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [2, 8, 4],
    6: [3, 7, 4],
    7: [6, 8, 4],
    8: [5, 7, 4]
};

let boardState = Array(9).fill(null); // null, 1 (P1/Red), 2 (P2/Teal)
let currentPlayer = 1; 
let piecesPlaced = { 1: 0, 2: 0 };
let selectedPoint = null;

// Tournament & Mode Setup
let gameMode = 2; // 2, 3, or 4
let currentStage = 1; // 1: Main Semi/First, 2: Secondary/Side, 3: Final
let p1Name = "Player 1";
let p2Name = "Player 2";
let matchWinners = {};
let isBotGame = false;

// Initialize Page
window.onload = () => {
    updateLanguage();
    initGame();
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
    updateStatusText();
}

function setMode(mode) {
    gameMode = mode;
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`mode-${mode}-btn`).classList.add('active');
    resetFullGame();
}

function resetFullGame() {
    currentStage = 1;
    matchWinners = {};
    setupTournamentStage();
}

function setupTournamentStage() {
    const t = translations[currentLang];
    isBotGame = false;

    if (gameMode === 2) {
        p1Name = translations[currentLang].p1Turn.split(' ')[0] + " 1";
        p2Name = translations[currentLang].p1Turn.split(' ')[0] + " 2";
        document.getElementById('tournament-info').innerText = "";
    } else if (gameMode === 3) {
        if (currentStage === 1) {
            p1Name = "Player 1";
            p2Name = "Player 2";
            document.getElementById('tournament-info').innerText = t.stageSemi1;
        } else if (currentStage === 2) {
            p1Name = "Player 3";
            p2Name = "Bot";
            isBotGame = true;
            document.getElementById('tournament-info').innerText = t.stageSideBot;
        } else if (currentStage === 3) {
            p1Name = matchWinners[1]; // Winner of P1 vs P2
            p2Name = matchWinners[2]; // Winner of P3 vs Bot
            document.getElementById('tournament-info').innerText = t.stageFinal + `${p1Name} vs ${p2Name}`;
        }
    } else if (gameMode === 4) {
        if (currentStage === 1) {
            p1Name = "Player 1";
            p2Name = "Player 2";
            document.getElementById('tournament-info').innerText = t.stageSemi1;
        } else if (currentStage === 2) {
            p1Name = "Player 3";
            p2Name = "Player 4";
            document.getElementById('tournament-info').innerText = t.stageSemi2;
        } else if (currentStage === 3) {
            p1Name = matchWinners[1];
            p2Name = matchWinners[2];
            document.getElementById('tournament-info').innerText = t.stageFinal + `${p1Name} vs ${p2Name}`;
        }
    }

    resetBoard();
}

function resetBoard() {
    boardState = Array(9).fill(null);
    currentPlayer = 1;
    piecesPlaced = { 1: 0, 2: 0 };
    selectedPoint = null;
    renderBoard();
    updateStatusText();
    document.getElementById('win-modal').style.display = 'none';
}

function updateStatusText() {
    const t = translations[currentLang];
    const status = document.getElementById('game-status');
    if (isBotGame && currentPlayer === 2) {
        status.innerText = t.botTurn;
    } else {
        status.innerText = currentPlayer === 1 ? `${p1Name} (Red)` : `${p2Name} (Teal)`;
    }
}

function renderBoard() {
    for (let i = 0; i < 9; i++) {
        const pt = document.querySelector(`.point[data-index='${i}']`);
        pt.className = 'point';
        if (boardState[i] === 1) pt.classList.add('p1');
        if (boardState[i] === 2) pt.classList.add('p2');
        if (selectedPoint === i) pt.classList.add('selected');
    }
}

// --- Player Interactions ---
function handlePointClick(index) {
    if (isBotGame && currentPlayer === 2) return; // Prevent human click during Bot turn

    // Phase 1: Placing Pieces (3 pieces each)
    if (piecesPlaced[1] < 3 || piecesPlaced[2] < 3) {
        if (piecesPlaced[currentPlayer] < 3 && boardState[index] === null) {
            boardState[index] = currentPlayer;
            piecesPlaced[currentPlayer]++;
            if (checkWin(currentPlayer)) {
                endMatch(currentPlayer);
                return;
            }
            switchTurn();
        }
    } 
    // Phase 2: Moving Pieces
    else {
        if (selectedPoint === null) {
            if (boardState[index] === currentPlayer) {
                selectedPoint = index;
            }
        } else {
            if (index === selectedPoint) {
                selectedPoint = null; // Deselect
            } else if (boardState[index] === null && ADJACENCY[selectedPoint].includes(index)) {
                boardState[selectedPoint] = null;
                boardState[index] = currentPlayer;
                selectedPoint = null;
                if (checkWin(currentPlayer)) {
                    endMatch(currentPlayer);
                    return;
                }
                switchTurn();
            } else if (boardState[index] === currentPlayer) {
                selectedPoint = index; // Switch selection
            }
        }
    }
    renderBoard();
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateStatusText();
    renderBoard();

    if (isBotGame && currentPlayer === 2) {
        setTimeout(makeBotMove, 600); // Bot thinks for 600ms
    }
}

// --- Moderate AI Logic ---
function makeBotMove() {
    // 1. Placement Phase
    if (piecesPlaced[2] < 3) {
        let move = getBestPlacementIndex();
        boardState[move] = 2;
        piecesPlaced[2]++;
        if (checkWin(2)) {
            endMatch(2);
            return;
        }
    } 
    // 2. Movement Phase
    else {
        let move = getBestMovementMove();
        if (move) {
            boardState[move.from] = null;
            boardState[move.to] = 2;
            if (checkWin(2)) {
                endMatch(2);
                return;
            }
        }
    }
    switchTurn();
}

function getBestPlacementIndex() {
    // Win if possible
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
            boardState[i] = 2;
            if (checkWin(2)) { boardState[i] = null; return i; }
            boardState[i] = null;
        }
    }
    // Block Player 1 win
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
            boardState[i] = 1;
            if (checkWin(1)) { boardState[i] = null; return i; }
            boardState[i] = null;
        }
    }
    // Prefer Center, then corners
    if (boardState[4] === null) return 4;
    const empties = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return empties[Math.floor(Math.random() * empties.length)];
}

function getBestMovementMove() {
    let myPieces = boardState.map((val, idx) => val === 2 ? idx : null).filter(val => val !== null);
    
    // Check win move
    for (let from of myPieces) {
        for (let to of ADJACENCY[from]) {
            if (boardState[to] === null) {
                boardState[from] = null; boardState[to] = 2;
                let win = checkWin(2);
                boardState[to] = null; boardState[from] = 2;
                if (win) return { from, to };
            }
        }
    }
    // Random valid move (Medium level feel)
    let validMoves = [];
    for (let from of myPieces) {
        for (let to of ADJACENCY[from]) {
            if (boardState[to] === null) validMoves.push({ from, to });
        }
    }
    return validMoves.length > 0 ? validMoves[Math.floor(Math.random() * validMoves.length)] : null;
}

function checkWin(player) {
    return WINNING_COMBOS.some(combo => combo.every(idx => boardState[idx] === player));
}

function endMatch(winner) {
    renderBoard();
    const t = translations[currentLang];
    const winnerName = winner === 1 ? p1Name : p2Name;
    matchWinners[currentStage] = winnerName;

    const modal = document.getElementById('win-modal');
    const winnerText = document.getElementById('winner-text');
    const winnerSubtext = document.getElementById('winner-subtext');
    const nextBtn = document.getElementById('modal-next-btn');

    winnerText.innerText = `${t.winMsg} 🎉`;

    if (gameMode === 2) {
        winnerSubtext.innerText = `${winnerName} ${t.champMsg}`;
        nextBtn.innerText = t.playAgainBtn;
    } else if (currentStage < 3) {
        winnerSubtext.innerText = `${t.winner} ${winnerName}`;
        nextBtn.innerText = t.nextMatchBtn;
    } else { // Stage 3 Final
        winnerSubtext.innerText = `🏆 ${winnerName} ${t.champMsg}`;
        nextBtn.innerText = t.playAgainBtn;
    }
    modal.style.display = 'flex';
}

function nextTournamentStep() {
    document.getElementById('win-modal').style.display = 'none';
    if (gameMode === 2 || currentStage === 3) {
        resetFullGame();
    } else {
        currentStage++;
        setupTournamentStage();
    }
}
