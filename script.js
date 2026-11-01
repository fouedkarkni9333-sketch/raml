const translations = {
    en: {
        title: "RAML",
        mode2: "2 Players",
        mode3: "3 Players",
        mode4: "4 Players",
        reset: "Reset Game",
        p1Turn: "Turn (White)",
        p2Turn: "Turn (Black)",
        botTurn: "Bot's Turn (Black)",
        winMsg: "Congratulations!",
        nextMatchBtn: "Next Match / Final",
        playAgainBtn: "Play Again",
        champMsg: "is the Grand Champion of RAML!",
        stageSemi1: "Match 1: Player 1 vs Player 2",
        stageSemi2: "Match 2: Player 3 vs Bot (AI)",
        stageSemi4_1: "Semi-Final 1: Player 1 vs Player 2",
        stageSemi4_2: "Semi-Final 2: Player 3 vs Player 4",
        stageFinal: "Grand Final: ",
        winner: "Winner:"
    },
    ar: {
        title: "لعبة الرمل (RAML)",
        mode2: "لاعبان",
        mode3: "3 لاعبين",
        mode4: "4 لاعبين",
        reset: "إعادة اللعبة",
        p1Turn: "دور (الأبيض)",
        p2Turn: "دور (الأسود)",
        botTurn: "دور الروبوت (الأسود)",
        winMsg: "مبروك الفوز!",
        nextMatchBtn: "المباراة التالية",
        playAgainBtn: "اللعب من جديد",
        champMsg: "هو البطل النهائي للعبة الرمل!",
        stageSemi1: "المباراة الأولى: اللاعب 1 ضد اللاعب 2",
        stageSemi2: "المباراة الثانية: اللاعب 3 ضد الروبوت",
        stageSemi4_1: "نصف النهائي 1: اللاعب 1 ضد اللاعب 2",
        stageSemi4_2: "نصف النهائي 2: اللاعب 3 ضد اللاعب 4",
        stageFinal: "النهائي الكبير: ",
        winner: "الفائز:"
    },
    fr: {
        title: "RAML - Jeu de Sable",
        mode2: "2 Joueurs",
        mode3: "3 Joueurs",
        mode4: "4 Joueurs",
        reset: "Réinitialiser",
        p1Turn: "Tour (Blanc)",
        p2Turn: "Tour (Noir)",
        botTurn: "Tour du Bot (Noir)",
        winMsg: "Félicitations!",
        nextMatchBtn: "Match Suivant",
        playAgainBtn: "Rejouer",
        champMsg: "est le Grand Champion de RAML!",
        stageSemi1: "Match 1: Joueur 1 vs Joueur 2",
        stageSemi2: "Match 2: Joueur 3 vs Bot",
        stageSemi4_1: "Demi-finale 1: Joueur 1 vs Joueur 2",
        stageSemi4_2: "Demi-finale 2: Joueur 3 vs Joueur 4",
        stageFinal: "Grande Finale: ",
        winner: "Gagnant:"
    }
};

let currentLang = 'en';

const WINNING_COMBOS = [
    [0,1,2], [3,4,5], [6,7,8], 
    [0,3,6], [1,4,7], [2,5,8], 
    [0,4,8], [2,4,6]          
];

let boardState = Array(9).fill(null);
let currentPlayer = 1; 
let piecesPlaced = { 1: 0, 2: 0 };
let selectedPoint = null;

let gameMode = 2;
let currentStage = 1;
let p1Name = "Player 1";
let p2Name = "Player 2";
let matchWinners = {};
let isBotGame = false;

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
    setupTournamentStage();
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
        p1Name = currentLang === 'ar' ? "اللاعب 1" : "Player 1";
        p2Name = currentLang === 'ar' ? "اللاعب 2" : "Player 2";
        document.getElementById('tournament-info').innerText = "";
    } else if (gameMode === 3) {
        if (currentStage === 1) {
            p1Name = currentLang === 'ar' ? "اللاعب 1" : "Player 1";
            p2Name = currentLang === 'ar' ? "اللاعب 2" : "Player 2";
            document.getElementById('tournament-info').innerText = t.stageSemi1;
        } else if (currentStage === 2) {
            p1Name = currentLang === 'ar' ? "اللاعب 3" : "Player 3";
            p2Name = currentLang === 'ar' ? "الروبوت" : "Bot";
            isBotGame = true;
            document.getElementById('tournament-info').innerText = t.stageSemi2;
        } else if (currentStage === 3) {
            p1Name = matchWinners[1] || (currentLang === 'ar' ? "اللاعب 1" : "Player 1");
            p2Name = matchWinners[2] || (currentLang === 'ar' ? "الروبوت" : "Bot");
            document.getElementById('tournament-info').innerText = t.stageFinal + `${p1Name} vs ${p2Name}`;
        }
    } else if (gameMode === 4) {
        if (currentStage === 1) {
            p1Name = currentLang === 'ar' ? "اللاعب 1" : "Player 1";
            p2Name = currentLang === 'ar' ? "اللاعب 2" : "Player 2";
            document.getElementById('tournament-info').innerText = t.stageSemi4_1;
        } else if (currentStage === 2) {
            p1Name = currentLang === 'ar' ? "اللاعب 3" : "Player 3";
            p2Name = currentLang === 'ar' ? "اللاعب 4" : "Player 4";
            document.getElementById('tournament-info').innerText = t.stageSemi4_2;
        } else if (currentStage === 3) {
            p1Name = matchWinners[1] || (currentLang === 'ar' ? "اللاعب 1" : "Player 1");
            p2Name = matchWinners[2] || (currentLang === 'ar' ? "اللاعب 3" : "Player 3");
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
        status.innerText = `${p2Name} - ${t.botTurn}`;
    } else {
        status.innerText = currentPlayer === 1 ? `${p1Name} : ${t.p1Turn}` : `${p2Name} : ${t.p2Turn}`;
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

function handlePointClick(index) {
    if (isBotGame && currentPlayer === 2) return;

    // Phase 1: Placing pieces
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
    // Phase 2: Moving pieces freely to any empty spot
    else {
        if (selectedPoint === null) {
            if (boardState[index] === currentPlayer) {
                selectedPoint = index;
            }
        } else {
            if (index === selectedPoint) {
                selectedPoint = null;
            } else if (boardState[index] === null) {
                boardState[selectedPoint] = null;
                boardState[index] = currentPlayer;
                selectedPoint = null;
                if (checkWin(currentPlayer)) {
                    endMatch(currentPlayer);
                    return;
                }
                switchTurn();
            } else if (boardState[index] === currentPlayer) {
                selectedPoint = index;
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
        setTimeout(makeBotMove, 500);
    }
}

function makeBotMove() {
    if (piecesPlaced[2] < 3) {
        let move = getBestPlacementIndex();
        boardState[move] = 2;
        piecesPlaced[2]++;
        if (checkWin(2)) {
            endMatch(2);
            return;
        }
    } else {
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
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
            boardState[i] = 2;
            if (checkWin(2)) { boardState[i] = null; return i; }
            boardState[i] = null;
        }
    }
    for (let i = 0; i < 9; i++) {
        if (boardState[i] === null) {
            boardState[i] = 1;
            if (checkWin(1)) { boardState[i] = null; return i; }
            boardState[i] = null;
        }
    }
    if (boardState[4] === null) return 4;
    const empties = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    return empties[Math.floor(Math.random() * empties.length)];
}

function getBestMovementMove() {
    let myPieces = boardState.map((val, idx) => val === 2 ? idx : null).filter(val => val !== null);
    for (let from of myPieces) {
        for (let to = 0; to < 9; to++) {
            if (boardState[to] === null) {
                boardState[from] = null; boardState[to] = 2;
                let win = checkWin(2);
                boardState[to] = null; boardState[from] = 2;
                if (win) return { from, to };
            }
        }
    }
    let validEmpties = boardState.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (myPieces.length > 0 && validEmpties.length > 0) {
        let from = myPieces[Math.floor(Math.random() * myPieces.length)];
        let to = validEmpties[Math.floor(Math.random() * validEmpties.length)];
        return { from, to };
    }
    return null;
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

    if (gameMode === 2 || currentStage === 3) {
        winnerSubtext.innerText = `${winnerName} ${t.champMsg}`;
        nextBtn.innerText = t.playAgainBtn;
    } else {
        winnerSubtext.innerText = `${t.winner} ${winnerName} - التأهل للنهائي!`;
        nextBtn.innerText = t.nextMatchBtn;
    }
    modal.style.display = 'flex';
}

function nextTournamentStep() {
    document.getElementById('win-modal').style.display = 'none';
    
    if (gameMode === 2) {
        resetFullGame();
    } else if (gameMode === 3) {
        if (currentStage === 1) {
            currentStage = 2; // الانتقال للمباراة الثانية (اللاعب 3 ضد الروبوت)
            setupTournamentStage();
        } else if (currentStage === 2) {
            currentStage = 3; // الانتقال للنهائي الكبير بين الفائزين
            setupTournamentStage();
        } else if (currentStage === 3) {
            resetFullGame(); // إعادة البطولة من جديد بعد انتهاء النهائي
        }
    } else if (gameMode === 4) {
        if (currentStage === 1) {
            currentStage = 2; // الانتقال لنصف النهائي الثاني (اللاعب 3 ضد اللاعب 4)
            setupTournamentStage();
        } else if (currentStage === 2) {
            currentStage = 3; // الانتقال للنهائي الكبير بين الفائزين
            setupTournamentStage();
        } else if (currentStage === 3) {
            resetFullGame(); // إعادة البطولة من جديد بعد انتهاء النهائي
        }
    }
}
