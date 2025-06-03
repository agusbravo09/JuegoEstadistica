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
    betSectionTitle.textContent = "Hace tu apuesta por total";
    totalBetSection.style.display = "block";
    exactBetSection.style.display = "none";
  }
});

exactBetType.addEventListener("change", () => {
  if (exactBetType.checked) {
    betSectionTitle.textContent = "Hace tu apuesta exacta";
    totalBetSection.style.display = "none";
    exactBetSection.style.display = "block";
  }
});

// Función para tirar un dado
function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

// Lógica tramposa: impide que ganes si se activa
function biasedRoll(multiplier = 0.3) {
  const isCheating = Math.random() < multiplier;
  let d1, d2;

  if (!isCheating) {
    return [rollDie(), rollDie()];
  }

  const totalBet = parseInt(document.getElementById("totalBet").value);
  const dice1Bet = parseInt(document.getElementById("dice1Bet").value);
  const dice2Bet = parseInt(document.getElementById("dice2Bet").value);

  do {
    d1 = rollDie();
    d2 = rollDie();
  } while (
    (totalBetType.checked && d1 + d2 === totalBet) ||
    (exactBetType.checked && d1 === dice1Bet && d2 === dice2Bet)
  );

  return [d1, d2];
}

// Animación visual del dado
function rotateDie(dieElement, value) {
  const rotations = {
    1: "rotateX(0deg) rotateY(0deg)",
    2: "rotateX(-90deg) rotateY(0deg)",
    3: "rotateY(-90deg) rotateX(0deg)",
    4: "rotateY(90deg) rotateX(0deg)",
    5: "rotateX(90deg) rotateY(0deg)",
    6: "rotateX(180deg) rotateY(0deg)"
  };
  dieElement.style.transform = rotations[value];
}

// Actualización de estadísticas
function updateStats(win, reward) {
  if (win !== undefined && reward !== undefined) {
    stats.plays++;
    if (win) stats.wins++;
    stats.balance += reward;
    if (stats.balance > stats.bestBalance) {
      stats.bestBalance = stats.balance;
    }
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
  document.getElementById("expectedValue").textContent = stats.expectedValue.toFixed(2);
  document.getElementById("empiricalDiff").textContent = diff;
}

// Acción al presionar "Tirar Dados"
rollBtn.addEventListener("click", () => {
  let betValue, win = false, reward = -10;
  const [d1, d2] = biasedRoll(0.3);

  // Rotar los dados visualmente
  rotateDie(die1, d1);
  rotateDie(die2, d2);

  if (totalBetType.checked) {
    betValue = parseInt(document.getElementById("totalBet").value);
    if (d1 + d2 === betValue) {
      win = true;
      reward = 50;
    }
  } else {
    const bet1 = parseInt(document.getElementById("dice1Bet").value);
    const bet2 = parseInt(document.getElementById("dice2Bet").value);
    if (d1 === bet1 && d2 === bet2) {
      win = true;
      reward = 100;
    }
  }

  // Mostrar resultado
  resultText.textContent = `Salieron ${d1} y ${d2}. ${win ? "¡Ganaste!" : "Perdiste..."}`;

  // Actualizar estadísticas
  updateStats(win, reward);
});

// Acción al presionar "Reiniciar Juego"
resetBtn.addEventListener("click", () => {
  stats = {
    balance: 100,
    plays: 0,
    wins: 0,
    bestBalance: 100,
    expectedValue: -0.5
  };
  resultText.textContent = "";
  updateStats();
});
