const startScreen = document.getElementById("startScreen");
const residentScreen = document.getElementById("residentScreen");
const boardScreen = document.getElementById("boardScreen");

const playerNameInput = document.getElementById("playerNameInput");
const startButton = document.getElementById("startButton");
const residentChoices = document.querySelectorAll(".resident-choice");

const playerAvatarImg = document.getElementById("playerAvatarImg");
const opponentAvatarImg = document.getElementById("opponentAvatarImg");

let playerName = "";
let offeredResidents = [];
let chosenResident = null;
let opponentResident = null;

const TOTAL_RESIDENTS = 32;

function padNumber(number) {
  return String(number).padStart(2, "0");
}

function residentCardPath(id) {
  return `assets/cartas/residentes/residente-${padNumber(id)}.png`;
}

function avatarPath(id) {
  return `assets/cartas/avatar/avatar-${padNumber(id)}.png`;
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function drawResidentOptions() {
  const allResidents = Array.from(
    { length: TOTAL_RESIDENTS },
    (_, index) => index + 1
  );

  offeredResidents = shuffle(allResidents).slice(0, 3);

  residentChoices.forEach((card, index) => {
    const residentId = offeredResidents[index];

    card.src = residentCardPath(residentId);
    card.dataset.residentId = residentId;
  });
}

function drawOpponentResident() {
  const allResidents = Array.from(
    { length: TOTAL_RESIDENTS },
    (_, index) => index + 1
  );

  const availableResidents = allResidents.filter(
    (id) => !offeredResidents.includes(id)
  );

  opponentResident = shuffle(availableResidents)[0];
  opponentAvatarImg.src = avatarPath(opponentResident);
}

playerNameInput.addEventListener("input", () => {
  startButton.disabled = playerNameInput.value.trim().length === 0;
});

startButton.addEventListener("click", () => {
  playerName = playerNameInput.value.trim();

  drawResidentOptions();

  startScreen.classList.remove("active");
  residentScreen.classList.add("active");
});

residentChoices.forEach((card) => {
  card.addEventListener("click", () => {
    chosenResident = Number(card.dataset.residentId);

    playerAvatarImg.src = avatarPath(chosenResident);
    drawOpponentResident();

    residentScreen.classList.remove("active");
    boardScreen.classList.add("active");
  });
});