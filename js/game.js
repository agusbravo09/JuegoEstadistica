const rollBtn = document.getElementById("rollBtn");
const resetBtn = document.getElementById("resetBtn");
const resultText = document.getElementById("resultText");
const dice1Img = document.getElementById("dice1Img");
const dice2Img = document.getElementById("dice2Img");

// Estadísticas
let stats = {
  balance: 0,
  plays: 0,
  wins: 0,
  bestBalance: 0,
  expectedValue: -0.5 // valor esperado teórico dado
};

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}

function biasedRoll(multiplier = 0.3) {
  return Math.random() < multiplier ? [rollDie(), rollDie()] : [rollDie(), rollDie()];
}

function updateStats(win, reward) {
  stats.plays++;
  if (win) stats.wins++;
  stats.balance += reward;
  if (stats.balance > stats.bestBalance) stats.bestBalance = stats.balance;
  const avg = (stats.balance / stats.plays).toFixed(2);
  const winPct = ((stats.wins / stats.plays) * 100).toFixed(1);
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

rollBtn.addEventListener("click", () => {
  const totalBet = parseInt(document.getElementById("totalBet").value);
  const dice1Bet = parseInt(document.getElementById("dice1Bet").value);
  const dice2Bet = parseInt(document.getElementById("dice2Bet").value);

  const [die1, die2] = biasedRoll(0.3);
  const total = die1 + die2;

  dice1Img.src = `assets/dice${die1}.png`;
  dice2Img.src = `assets/dice${die2}.png`;

  let result = `Salió ${die1} y ${die2} (Total: ${total}). `;
  let win = false;
  let reward = -1; // cada jugada cuesta 1

  if (!isNaN(totalBet) && total === totalBet) {
    reward = 5; // pago por acertar total
    result += "¡Ganaste por total! ";
    win = true;
  }

  if (!isNaN(dice1Bet) && !isNaN(dice2Bet) && die1 === dice1Bet && die2 === dice2Bet) {
    reward = 10; // pago mayor por dados exactos
    result += "¡Ganaste por dados! ";
    win = true;
  }

  if (!win) {
    result += "Perdiste esta vez.";
  }

  resultText.textContent = result;
  updateStats(win, reward - 1); // resta la apuesta inicial
});

resetBtn.addEventListener("click", () => {
  stats = { balance: 0, plays: 0, wins: 0, bestBalance: 0, expectedValue: -0.5 };
  resultText.textContent = "";
  updateStats(false, 0);
});
