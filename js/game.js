// Elementos del DOM
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const resultText = document.getElementById("resultText");
const totalBetType = document.getElementById("totalBetType");
const exactBetType = document.getElementById("exactBetType");
const betSectionTitle = document.getElementById("betSectionTitle");
const totalBetSection = document.getElementById("totalBetSection");
const exactBetSection = document.getElementById("exactBetSection");
const die1Img = document.getElementById("die1Img");
const die2Img = document.getElementById("die2Img");

// Estadísticas
let stats = {
  balance: 100,
  plays: 0,
  wins: 0,
  bestBalance: 100,
  expectedValue: -0.5
};

// Inicialización
updateStats();

// Manejadores de tipo de apuesta
totalBetType.addEventListener("change", () => {
  if (totalBetType.checked) {
    betSectionTitle.textContent = "Hacé tu apuesta por total";
    totalBetSection.style.display = "block";
    exactBetSection.style.display = "none";
  }
});

exactBetType.addEventListener("change", () => {
  if (exactBetType.checked) {
    betSectionTitle.textContent = "Hacé tu apuesta exacta";
    totalBetSection.style.display = "none";
    exactBetSection.style.display = "block";
  }
});

// Funciones del juego
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function biasedRoll(multiplier = 0.3) {
  if (Math.random() < multiplier) {
    const totalBet = parseInt(document.getElementById("totalBet").value);
    const dice1Bet = parseInt(document.getElementById("dice1Bet").value);
    const dice2Bet = parseInt(document.getElementById("dice2Bet").value);
    
    let die1, die2;
    do {
      die1 = rollDie();
      die2 = rollDie();
    } while (
      (totalBetType.checked && (die1 + die2) === totalBet) ||
      (exactBetType.checked && die1 === dice1Bet && die2 === dice2Bet)
    );
    
    return [die1, die2];
  }
  return [rollDie(), rollDie()];
}

function updateStats(win, reward) {
  if (win !== undefined && reward !== undefined) {
    stats.plays++;
    if (win) stats.wins++;
    stats.balance += reward;
    if (stats.balance > stats.bestBalance) stats.bestBalance = stats.balance;
  }

  const avg = (stats.balance / (stats.plays || 1)).toFixed(2);
  const winPct = ((stats.wins / (stats.plays || 1)) * 100).toFixed(1);
  const lossPct = (100 - winPct).toFixed(1);
  const diff = (avg - stats.expectedValue).toFixed(2);

  document.getElementById("balance").textContent = stats.balance;
  document.getElementById("totalPlays").textContent = stats.plays;
  document.getElementById("avgPerPlay").textContent = avg;
  document.getElementById("wins").textContent = stats.wins;
  document.getElementById("winPercent").textContent = winPct;
  document.getElementById("lossPercent").textContent = lossPct;
  document.getElementById("bestBalance").textContent = stats.bestBalance;
  document.getElementById("empiricalDiff").textContent = diff;
}

// Evento de lanzamiento de dados
rollBtn.addEventListener("click", () => {
  const isTotalBet = totalBetType.checked;
  let totalBet, dice1Bet, dice2Bet;

  if (isTotalBet) {
    totalBet = parseInt(document.getElementById("totalBet").value);
    if (isNaN(totalBet) || totalBet < 2 || totalBet > 12) {
      resultText.textContent = "⚠️ Por favor ingresa un total válido (2-12)";
      return;
    }
  } else {
    dice1Bet = parseInt(document.getElementById("dice1Bet").value);
    dice2Bet = parseInt(document.getElementById("dice2Bet").value);
    if (isNaN(dice1Bet) || isNaN(dice2Bet) || dice1Bet < 1 || dice1Bet > 6 || dice2Bet < 1 || dice2Bet > 6) {
      resultText.textContent = "⚠️ Por favor ingresa valores válidos para los dados (1-6)";
      return;
    }
  }

  if (stats.balance < 1) {
    resultText.textContent = "¡No tienes suficiente saldo! Reinicia el juego para empezar de nuevo.";
    return;
  }

  rollBtn.disabled = true;
  resultText.textContent = "Los dados están girando...";

  setTimeout(() => {
    const [die1Result, die2Result] = biasedRoll(0.3);
    const total = die1Result + die2Result;

    // Mostrar las imágenes correctas
    die1Img.src = `images/lado${die1Result}.png`;
    die2Img.src = `images/lado${die2Result}.png`;

    let result = `Salió ${die1Result} y ${die2Result} (Total: ${total}). `;
    let win = false;
    let reward = -1; // Apuesta perdida

    if (isTotalBet && total === totalBet) {
      reward = 5;
      result += "¡Ganaste $5 por acertar el total! ";
      win = true;
    } else if (!isTotalBet && die1Result === dice1Bet && die2Result === dice2Bet) {
      reward = 10;
      result += "¡Ganaste $10 por acertar los dados exactos! ";
      win = true;
    } else {
      result += "Perdiste $1 esta vez.";
    }

    resultText.textContent = result;
    updateStats(win, reward);
    rollBtn.disabled = false;
  }, 1000);
});

// Reinicio del juego
resetBtn.addEventListener("click", () => {
  stats = { balance: 100, plays: 0, wins: 0, bestBalance: 100, expectedValue: -0.5 };
  resultText.textContent = "Juego reiniciado. ¡Buena suerte!";
  die1Img.src = "images/lado1.png";
  die2Img.src = "images/lado1.png";
  updateStats();
});
