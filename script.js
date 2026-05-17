const startScreen = document.getElementById("startScreen");
const residentScreen = document.getElementById("residentScreen");
const boardScreen = document.getElementById("boardScreen");

const playerNameInput = document.getElementById("playerNameInput");
const startButton = document.getElementById("startButton");
const residentChoices = document.querySelectorAll(".resident-choice");

const playerAvatarImg = document.getElementById("playerAvatarImg");
const opponentAvatarImg = document.getElementById("opponentAvatarImg");

const residentModal = document.getElementById("residentModal");
const residentModalCard = document.getElementById("residentModalCard");
const residentModalClose = document.getElementById("residentModalClose");
const residentConfirmButton = document.getElementById("residentConfirmButton");

const cardModal = document.getElementById("cardModal");
const cardModalImg = document.getElementById("cardModalImg");
const cardModalClose = document.getElementById("cardModalClose");

let previewResident = null;

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
    previewResident = Number(card.dataset.residentId);

    residentModalCard.src = residentCardPath(previewResident);
    residentModal.classList.add("active");
  });
});

residentModalClose.addEventListener("click", () => {
  previewResident = null;
  residentModal.classList.remove("active");
});

residentConfirmButton.addEventListener("click", () => {
  if (!previewResident) return;

  chosenResident = previewResident;

  playerAvatarImg.src = avatarPath(chosenResident);
  drawOpponentResident();

  createBossDeck();
  createTacticDeck();
  renderTacticDrawPile();

  drawBosses();
  renderOpponentHiddenTactics();

  residentModal.classList.remove("active");
  residentScreen.classList.remove("active");
  boardScreen.classList.add("active");
});

const opponentBoss1 = document.getElementById("opponentBoss1");
const opponentBoss2 = document.getElementById("opponentBoss2");
const playerBoss1 = document.getElementById("playerBoss1");
const playerBoss2 = document.getElementById("playerBoss2");

const opponentHandCards = document.querySelectorAll(".opponent-hand .card");

const TOTAL_BOSSES = 36;
const TOTAL_EVENTOS = 38;
const TOTAL_ITENS = 30;
const TOTAL_LOCAIS = 39;

function bossPath(id) {
  return `assets/cartas/chefes/chefe-${padNumber(id)}.png`;
}

function tacticPath(type, id) {
  return `assets/cartas/tatica/${type}/${type}-${padNumber(id)}.png`;
}

function tacticBackPath(type) {
  return `assets/cartas/back/back-${type}.png`;
}

function drawBosses() {
  const bosses = shuffle(
    Array.from({ length: TOTAL_BOSSES }, (_, index) => index + 1)
  );

  playerBoss1.src = bossPath(bosses[0]);
  playerBoss2.src = bossPath(bosses[1]);

  opponentBoss1.src = bossPath(bosses[2]);
  opponentBoss2.src = bossPath(bosses[3]);

  [playerBoss1, playerBoss2, opponentBoss1, opponentBoss2].forEach((bossCard) => {
    bossCard.onclick = () => openCardModal(bossCard.src);
  });

}

function drawRandomTactic() {
  const deck = [
    ...Array.from({ length: TOTAL_EVENTOS }, (_, index) => ({
      type: "evento",
      id: index + 1,
    })),
    ...Array.from({ length: TOTAL_ITENS }, (_, index) => ({
      type: "item",
      id: index + 1,
    })),
    ...Array.from({ length: TOTAL_LOCAIS }, (_, index) => ({
      type: "local",
      id: index + 1,
    })),
  ];

  return shuffle(deck)[0];
}

function renderOpponentHiddenTactics() {
  opponentHandCards.forEach((card, index) => {
    card.innerHTML = "";

    if (index >= 3) {
      card.style.visibility = "hidden";
      card.onclick = null;
      return;
    }

    const tactic = drawRandomTactic();

    const face = document.createElement("img");
    face.className = "card-face";
    face.src = tacticPath(tactic.type, tactic.id);

    const back = document.createElement("img");
    back.className = "card-back";
    back.src = tacticBackPath(tactic.type);

    card.onclick = () => openCardModal(back.src);

    card.appendChild(face);
    card.appendChild(back);
  });
}

const tacticDrawPile = document.getElementById("tacticDrawPile");

let tacticDeck = [];
let tacticDiscard = [];
let bossDeck = [];
let bossDiscard = [];

function createBossDeck() {
  bossDeck = shuffle(
    Array.from({ length: TOTAL_BOSSES }, (_, index) => ({
      type: "chefe",
      id: index + 1,
      face: bossPath(index + 1),
      back: "assets/cartas/back/back-chefe.png",
    }))
  );
}

function createTacticDeck() {
  tacticDeck = shuffle([
    ...Array.from({ length: TOTAL_EVENTOS }, (_, index) => ({
      type: "evento",
      id: index + 1,
      face: tacticPath("evento", index + 1),
      back: tacticBackPath("evento"),
    })),
    ...Array.from({ length: TOTAL_ITENS }, (_, index) => ({
      type: "item",
      id: index + 1,
      face: tacticPath("item", index + 1),
      back: tacticBackPath("item"),
    })),
    ...Array.from({ length: TOTAL_LOCAIS }, (_, index) => ({
      type: "local",
      id: index + 1,
      face: tacticPath("local", index + 1),
      back: tacticBackPath("local"),
    })),
  ]);
}

function renderTacticDrawPile() {
  if (tacticDeck.length === 0) return;

  const topCard = tacticDeck[0];

  tacticDrawPile.innerHTML = `
    <img src="${topCard.back}" alt="Deck de táticas" />
  `;
}

function openCardModal(src) {
  if (!src) return;

  cardModalImg.src = src;
  cardModal.classList.add("active");
}

function closeCardModal() {
  cardModal.classList.remove("active");
  cardModalImg.src = "";
}

cardModalClose.addEventListener("click", closeCardModal);

cardModal.addEventListener("click", (event) => {
  if (event.target === cardModal) {
    closeCardModal();
  }
});