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

const bossDrawPile = document.getElementById("bossDrawPile");
const playerHandCards = document.querySelectorAll(".player-hand .card");

const playerEnergy = document.getElementById("playerEnergy");
const opponentEnergy = document.getElementById("opponentEnergy");

const playerEnergyPlus = document.getElementById("playerEnergyPlus");
const playerEnergyMinus = document.getElementById("playerEnergyMinus");

const opponentEnergyPlus = document.getElementById("opponentEnergyPlus");
const opponentEnergyMinus = document.getElementById("opponentEnergyMinus");

const playerScore = document.getElementById("playerScore");
const opponentScore = document.getElementById("opponentScore");

const playerScorePlus = document.getElementById("playerScorePlus");
const playerScoreMinus = document.getElementById("playerScoreMinus");

const opponentScorePlus = document.getElementById("opponentScorePlus");
const opponentScoreMinus = document.getElementById("opponentScoreMinus");

const playerNameDisplay = document.getElementById("playerNameDisplay");

const startTurnButton = document.getElementById("startTurnButton");

const battleModal = document.getElementById("battleModal");
const battleModalClose = document.getElementById("battleModalClose");

const battlePlayerAvatarImg = document.getElementById("battlePlayerAvatarImg");
const battlePlayerHand = document.getElementById("battlePlayerHand");

const battleBossCard = document.getElementById("battleBossCard");

let previewResident = null;

let playerName = "";
let offeredResidents = [];
let chosenResident = null;
let opponentResident = null;

let playerTacticHand = [];
let playerBossHand = [];

let isChoosingBossForBattle = false;
let selectedBossForBattle = null;

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
  playerNameDisplay.textContent = playerName;

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
  attachAvatarModals();

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

const playerBossCards = [playerBoss1, playerBoss2];


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
  const opponentBossA = bossDeck.shift();
  const opponentBossB = bossDeck.shift();

  opponentBoss1.src = opponentBossA.face;
  opponentBoss2.src = opponentBossB.face;

  opponentBoss1.onclick = () => openCardModal(opponentBossA.face);
  opponentBoss2.onclick = () => openCardModal(opponentBossB.face);

  playerBossHand = [];
  renderPlayerBossHand();
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

function renderBattlePlayerArea() {
  if (selectedBossForBattle) {
    battleBossCard.src = selectedBossForBattle.face;
    battleBossCard.onclick = () => openCardModal(selectedBossForBattle.face);
  }
  battlePlayerAvatarImg.src = playerAvatarImg.src;

  battlePlayerAvatarImg.onclick = () => {
    if (!chosenResident) return;
    openCardModal(residentCardPath(chosenResident));
  };

  battlePlayerHand.innerHTML = "";

  playerTacticHand.forEach((card, index) => {
    const slot = document.createElement("div");
    slot.className = `card fan f${index + 1}`;

    const img = document.createElement("img");
    img.src = card.face;
    img.alt = `${card.type}-${padNumber(card.id)}`;

    slot.appendChild(img);

    slot.onclick = () => openCardModal(card.face);

    battlePlayerHand.appendChild(slot);
  });
}

function openCardModal(src, options = {}) {
  if (!src) return;

  cardModalImg.src = src;
  cardModal.classList.add("active");

  const oldBattleButton = cardModal.querySelector(".battle-button");
  if (oldBattleButton) oldBattleButton.remove();

  if (options.showBattleButton) {
    const battleButton = document.createElement("button");
    battleButton.className = "battle-button";
    battleButton.textContent = "BATALHAR";

    battleButton.addEventListener("click", () => {
      closeCardModal();
      renderBattlePlayerArea();
      battleModal.classList.add("active");
      isChoosingBossForBattle = false;
    });

    cardModal.appendChild(battleButton);
  }
}

function closeCardModal() {
  cardModal.classList.remove("active");
  cardModalImg.src = "";

  const oldBattleButton = cardModal.querySelector(".battle-button");
  if (oldBattleButton) oldBattleButton.remove();
}

cardModalClose.addEventListener("click", closeCardModal);

cardModal.addEventListener("click", (event) => {
  if (event.target === cardModal) {
    closeCardModal();
  }
});

function drawFromTacticDeck() {
  if (playerTacticHand.length >= 6) {
    alert("Você não pode comprar mais de 6 cartas táticas.");
    return;
  }

  if (tacticDeck.length === 0) {
    tacticDeck = shuffle(tacticDiscard);
    tacticDiscard = [];
  }

  if (tacticDeck.length === 0) return;

  const card = tacticDeck.shift();
  playerTacticHand.push(card);

  renderPlayerTacticHand();
  renderTacticDrawPile();
}

function renderPlayerTacticHand() {
  playerHandCards.forEach((slot, index) => {
    slot.innerHTML = "";

    const card = playerTacticHand[index];

    if (!card) {
      slot.classList.remove("has-card");
      slot.onclick = null;
      return;
    }

    slot.classList.add("has-card");

    const img = document.createElement("img");
    img.src = card.face;
    img.alt = `${card.type}-${padNumber(card.id)}`;

    slot.appendChild(img);

    slot.onclick = () => openCardModal(card.face);
  });
}

function drawFromBossDeck() {
  if (playerBossHand.length >= 2) {
    alert("Você não pode comprar mais de 2 cartas chefe.");
    return;
  }

  if (bossDeck.length === 0) {
    bossDeck = shuffle(bossDiscard);
    bossDiscard = [];
  }

  if (bossDeck.length === 0) return;

  const card = bossDeck.shift();
  playerBossHand.push(card);

  renderPlayerBossHand();
}

function renderPlayerBossHand() {
  playerBossCards.forEach((slot, index) => {
    const card = playerBossHand[index];

    if (!card) {
      slot.removeAttribute("src");
      slot.onclick = null;
      return;
    }

    slot.src = card.face;

    slot.onclick = () => {
      selectedBossForBattle = card;

      openCardModal(card.face, {
        showBattleButton: isChoosingBossForBattle,
      });
    };
  });
}

tacticDrawPile.addEventListener("click", drawFromTacticDeck);
bossDrawPile.addEventListener("click", drawFromBossDeck);

let playerEnergyValue = 7;
let opponentEnergyValue = 7;

function updateEnergyDisplays() {
  playerEnergy.textContent = playerEnergyValue;
  opponentEnergy.textContent = opponentEnergyValue;
}

playerEnergyPlus.addEventListener("click", () => {
  playerEnergyValue++;
  updateEnergyDisplays();
});

playerEnergyMinus.addEventListener("click", () => {
  playerEnergyValue = Math.max(0, playerEnergyValue - 1);
  updateEnergyDisplays();
});

opponentEnergyPlus.addEventListener("click", () => {
  opponentEnergyValue++;
  updateEnergyDisplays();
});

opponentEnergyMinus.addEventListener("click", () => {
  opponentEnergyValue = Math.max(0, opponentEnergyValue - 1);
  updateEnergyDisplays();
});

updateEnergyDisplays();

let playerScoreValue = 0;
let opponentScoreValue = 0;

function updateScoreDisplays() {
  playerScore.textContent = playerScoreValue;
  opponentScore.textContent = opponentScoreValue;
}

playerScorePlus.addEventListener("click", () => {
  playerScoreValue++;
  updateScoreDisplays();
});

playerScoreMinus.addEventListener("click", () => {
  playerScoreValue = Math.max(0, playerScoreValue - 1);
  updateScoreDisplays();
});

opponentScorePlus.addEventListener("click", () => {
  opponentScoreValue++;
  updateScoreDisplays();
});

opponentScoreMinus.addEventListener("click", () => {
  opponentScoreValue = Math.max(0, opponentScoreValue - 1);
  updateScoreDisplays();
});

updateScoreDisplays();

function attachAvatarModals() {
  playerAvatarImg.onclick = () => {
    if (!chosenResident) return;
    openCardModal(residentCardPath(chosenResident));
  };

  opponentAvatarImg.onclick = () => {
    if (!opponentResident) return;
    openCardModal(residentCardPath(opponentResident));
  };
}

startTurnButton.addEventListener("click", () => {
  isChoosingBossForBattle = true;
  selectedBossForBattle = null;
  alert("Escolha um chefe para batalhar.");
});

battleModalClose.addEventListener("click", () => {
  battleModal.classList.remove("active");
});