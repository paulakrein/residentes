// Layout estático por enquanto.
// Funcionalidades entram depois.
console.log("Residentes layout carregado.");

const startScreen = document.getElementById("startScreen");
const residentScreen = document.getElementById("residentScreen");
const boardScreen = document.getElementById("boardScreen");

const playerNameInput = document.getElementById("playerNameInput");
const startButton = document.getElementById("startButton");
const residentChoices = document.querySelectorAll(".resident-choice");

let playerName = "";

playerNameInput.addEventListener("input", () => {
  const hasName = playerNameInput.value.trim().length > 0;
  startButton.disabled = !hasName;
});

startButton.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();

  startScreen.classList.remove("active");
  residentScreen.classList.add("active");
});

residentChoices.forEach((card) => {
  card.addEventListener("click", () => {
    residentScreen.classList.remove("active");
    boardScreen.classList.add("active");
  });
});