const gameArea = document.getElementById("game-area");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");
const bestText = document.getElementById("best");

const startScreen = document.getElementById("start-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

const finalScore = document.getElementById("final-score");

let score = 0;
let timeLeft = 30;
let timer = null;
let spawnTimer = null;
let playing = false;

// Önceki rekoru tarayıcıda sakla.
let bestScore = Number(localStorage.getItem("starBest")) || 0;
bestText.textContent = bestScore;

// Oyunu başlat.
function startGame() {
    clearInterval(timer);
    clearInterval(spawnTimer);

    score = 0;
    timeLeft = 30;
    playing = true;

    scoreText.textContent = score;
    timeText.textContent = timeLeft;

    startScreen.classList.add("hidden");
    endScreen.classList.add("hidden");

    // Önceki oyundan kalan yıldızları temizle.
    document.querySelectorAll(".star").forEach(star => star.remove());

    // İlk yıldızı hemen çıkar.
    spawnStar();

    // Belirli aralıklarla yeni yıldız üret.
    spawnTimer = setInterval(spawnStar, 700);

    // Süreyi her saniye azalt.
    timer = setInterval(() => {
        timeLeft--;
        timeText.textContent = timeLeft;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Oyun alanında rastgele yıldız oluştur.
function spawnStar() {
    if (!playing) return;

    const star = document.createElement("button");

    star.className = "star";
    star.textContent = "★";
    star.setAttribute("aria-label", "Yıldızı yakala");

    const maxX = gameArea.clientWidth - 46;
    const maxY = gameArea.clientHeight - 46;

    const x = Math.random() * Math.max(0, maxX);
    const y = Math.random() * Math.max(0, maxY);

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    // Yıldıza dokununca puan ver.
    star.addEventListener("click", () => {
        if (!playing) return;

        score++;
        scoreText.textContent = score;

        // Yakalanan yıldızı kaldır.
        star.remove();
    });

    gameArea.appendChild(star);

    // Yakalanmayan yıldız bir süre sonra kaybolsun.
    setTimeout(() => {
        star.remove();
    }, 1800);
}

// Oyunu bitir.
function endGame() {
    playing = false;

    clearInterval(timer);
    clearInterval(spawnTimer);

    document.querySelectorAll(".star").forEach(star => star.remove());

    // Yeni rekor varsa kaydet.
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem("starBest", bestScore);
        bestText.textContent = bestScore;
    }

    finalScore.textContent = score;
    endScreen.classList.remove("hidden");
}

// Butonlara tıklanınca oyunu başlat.
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);