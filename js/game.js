// Elementos del DOM
const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const resultText = document.getElementById("resultText");
const totalBetType = document.getElementById("totalBetType");
const exactBetType = document.getElementById("exactBetType");
const betSectionTitle = document.getElementById("betSectionTitle");
const totalBetSection = document.getElementById("totalBetSection");
const exactBetSection = document.getElementById("exactBetSection");
const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");

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
    betSectionTitle.textContent = "Haz tu apuesta por total";
    totalBetSection.style.display = "block";
    exactBetSection.style.display = "none";
  }
});

exactBetType.addEventListener("change", () => {
  if (exactBetType.checked) {
    betSectionTitle.textContent = "Haz tu apuesta exacta";
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

function rotateDie(dieElement, value) {
  const rotations = {
    1: "rotateX(0deg) rotateY(0deg)",        // front (1)
    2: "rotateX(-90deg) rotateY(0deg)",      // bottom (2)
    3: "rotateY(-90deg) rotateX(0deg)",      // left (3)
    4: "rotateY(90deg) rotateX(0deg)",       // right (4)
    5: "rotateX(90deg) rotateY(0deg)",       // top (5)
    6: "rotateX(180deg) rotateY(0deg)"       // back (6)
  };

  dieElement.style.transform = rotations[value];
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

  // Animación de lanzamiento
  die1.classList.add("rolling");
  die2.classList.add("rolling");
  rollBtn.disabled = true;
  resultText.textContent = "Los dados están girando...";

  setTimeout(() => {
    const [die1Result, die2Result] = biasedRoll(0.3);
    const total = die1Result + die2Result;

    // Detener animación y mostrar resultado
    die1.classList.remove("rolling");
    die2.classList.remove("rolling");
    rotateDie(die1, die1Result);
    rotateDie(die2, die2Result);

    let result = `Salió ${die1Result} y ${die2Result} (Total: ${total}). `;
    let win = false;
    let reward = -1; // Costo base por jugar

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
  }, 1500);
});

// Reinicio del juego
resetBtn.addEventListener("click", () => {
  stats = { balance: 100, plays: 0, wins: 0, bestBalance: 100, expectedValue: -0.5 };
  resultText.textContent = "Juego reiniciado. ¡Buena suerte!";
  rotateDie(die1, 1);
  rotateDie(die2, 1);
  updateStats();
});
