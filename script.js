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
const playerAllySlot = document.getElementById("playerAllySlot");
const battleAllyCard = document.getElementById("battleAllyCard");

const opponentAllySlot = document.getElementById("opponentAllySlot");
const switchPlayerButton = document.getElementById("switchPlayerButton");

const settingsButton = document.getElementById("settingsButton");

const settingsModal = document.getElementById("settingsModal");
const settingsModalClose = document.getElementById("settingsModalClose");

const restartGameButton = document.getElementById("restartGameButton");
const rulesButton = document.getElementById("rulesButton");
const creditsButton = document.getElementById("creditsButton");

let previewResident = null;

let playerName = "";
let opponentName = "Adversário";
let offeredResidents = [];
let chosenResident = null;
let opponentResident = null;

let playerTacticHand = [];
let playerBossHand = [];

let opponentTacticHand = [];
let opponentBossHand = [];

let isChoosingBossForBattle = false;
let selectedBossForBattle = null;

let selectedBossForBattleIndex = null;
let playerAllyBoss = null;

let opponentAllyBoss = null;

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

  drawOpponentInitialTactics();
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
  opponentBossHand = [
    bossDeck.shift(),
    bossDeck.shift(),
  ].filter(Boolean);

  playerBossHand = [];

  renderOpponentBossHand();
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
  opponentHandCards.forEach((cardSlot, index) => {
    cardSlot.innerHTML = "";

    const card = opponentTacticHand[index];

    if (!card) {
      cardSlot.style.visibility = "hidden";
      cardSlot.onclick = null;
      return;
    }

    cardSlot.style.visibility = "visible";

    const face = document.createElement("img");
    face.className = "card-face";
    face.src = card.face;

    const back = document.createElement("img");
    back.className = "card-back";
    back.src = card.back;

    cardSlot.onclick = () => openCardModal(card.back);

    cardSlot.appendChild(face);
    cardSlot.appendChild(back);
  });
}

function drawOpponentInitialTactics() {
  opponentTacticHand = [];

  for (let i = 0; i < 3; i++) {
    if (tacticDeck.length === 0) return;
    opponentTacticHand.push(tacticDeck.shift());
  }
}

function renderOpponentBossHand() {
  const opponentBossCards = [opponentBoss1, opponentBoss2];

  opponentBossCards.forEach((slot, index) => {
    const card = opponentBossHand[index];

    if (!card) {
      slot.removeAttribute("src");
      slot.style.visibility = "hidden";
      slot.onclick = null;
      return;
    }

    slot.src = card.face;
    slot.style.visibility = "visible";
    slot.onclick = () => openCardModal(card.face);
  });
}

function renderOpponentAllyBoss() {
  opponentAllySlot.innerHTML = "";

  if (!opponentAllyBoss) {
    opponentAllySlot.classList.remove("has-ally");
    opponentAllySlot.onclick = null;
    return;
  }

  opponentAllySlot.classList.add("has-ally");

  const img = document.createElement("img");
  img.src = opponentAllyBoss.face;
  img.alt = `chefe-aliado-${padNumber(opponentAllyBoss.id)}`;

  opponentAllySlot.appendChild(img);

  opponentAllySlot.onclick = () => openCardModal(opponentAllyBoss.face);
}

function renderWholeBoard() {
  playerAvatarImg.src = chosenResident ? avatarPath(chosenResident) : "";
  opponentAvatarImg.src = opponentResident ? avatarPath(opponentResident) : "";

  playerNameDisplay.textContent = playerName;

  updateEnergyDisplays();
  updateScoreDisplays();

  renderPlayerTacticHand();
  renderOpponentHiddenTactics();

  renderPlayerBossHand();
  renderOpponentBossHand();

  renderPlayerAllyBoss();
  renderOpponentAllyBoss();

  attachAvatarModals();
}

function swapPlayers() {
  battleModal.classList.remove("active");
  closeCardModal();
  resetBattleModal();

  [chosenResident, opponentResident] = [opponentResident, chosenResident];

  [playerName, opponentName] = [opponentName, playerName];

  [playerTacticHand, opponentTacticHand] = [opponentTacticHand, playerTacticHand];
  [playerBossHand, opponentBossHand] = [opponentBossHand, playerBossHand];
  [playerAllyBoss, opponentAllyBoss] = [opponentAllyBoss, playerAllyBoss];

  [playerEnergyValue, opponentEnergyValue] = [opponentEnergyValue, playerEnergyValue];
  [playerScoreValue, opponentScoreValue] = [opponentScoreValue, playerScoreValue];

  isChoosingBossForBattle = false;
  selectedBossForBattle = null;
  selectedBossForBattleIndex = null;

  renderWholeBoard();
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

    battleBossCard.onclick = () => openCardModal(selectedBossForBattle.face, {
      showAllyButton: true,
      allySourceIndex: selectedBossForBattleIndex,
    });
  }
  
  if (playerAllyBoss) {
    battleAllyCard.src = playerAllyBoss.face;
    battleAllyCard.classList.add("active");
    battleAllyCard.onclick = () => openCardModal(playerAllyBoss.face);
  } else {
    battleAllyCard.removeAttribute("src");
    battleAllyCard.classList.remove("active");
    battleAllyCard.onclick = null;
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

function resetBattleModal() {
  document.getElementById("table-top").innerHTML = "";
  document.getElementById("roll").setAttribute("disabled", "");

  document.querySelectorAll(".attribute-note").forEach((note) => {
    note.textContent = "0";
  });

  currentAttributeNoteIndex = 0;

  battlePlayerHand.innerHTML = "";
  battleBossCard.removeAttribute("src");
  battleBossCard.onclick = null;
  
  battleAllyCard.removeAttribute("src");
  battleAllyCard.classList.remove("active");
  battleAllyCard.onclick = null;

  selectedBossForBattle = null;
  selectedBossForBattleIndex = null;
}

function openCardModal(src, options = {}) {
  if (!src) return;

  cardModalImg.src = src;
  cardModal.classList.add("active");

  const oldBattleButton = cardModal.querySelector(".battle-button");
  if (oldBattleButton) oldBattleButton.remove();

  const oldDiscardButton = cardModal.querySelector(".discard-button");
  if (oldDiscardButton) oldDiscardButton.remove();

  const oldAllyButton = cardModal.querySelector(".ally-button");
  if (oldAllyButton) oldAllyButton.remove();

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

  if (options.showAllyButton) {
    const allyButton = document.createElement("button");
    allyButton.className = "ally-button";
    allyButton.textContent = "TORNAR ALIADO";

    allyButton.addEventListener("click", () => {
      if (playerAllyBoss) {
        alert("Você já tem um chefe aliado.");
        return;
      }

      const alliedBoss = playerBossHand.splice(options.allySourceIndex, 1)[0];
      if (!alliedBoss) return;

      playerAllyBoss = alliedBoss;

      selectedBossForBattle = null;
      selectedBossForBattleIndex = null;

      renderPlayerBossHand();
      renderPlayerAllyBoss();

      battleBossCard.removeAttribute("src");
      battleBossCard.onclick = null;

      closeCardModal();

      battleModal.classList.remove("active");
      resetBattleModal();
    });

    cardModal.appendChild(allyButton);
  }

  if (options.showDiscardButton) {
    const discardButton = document.createElement("button");
    discardButton.className = "discard-button";
    discardButton.textContent = "DESCARTAR";

    discardButton.addEventListener("click", () => {
      if (options.discardType === "tactic") {
        const discardedCard = playerTacticHand.splice(options.cardIndex, 1)[0];
        if (discardedCard) tacticDiscard.push(discardedCard);

        renderPlayerTacticHand();
        renderBattlePlayerArea();
      }

      if (options.discardType === "boss") {
        const discardedCard = playerBossHand.splice(options.cardIndex, 1)[0];

        if (discardedCard) {
          bossDiscard.push(discardedCard);

          if (selectedBossForBattle === discardedCard) {
            selectedBossForBattle = null;
            selectedBossForBattleIndex = null;
          }
        }

        renderPlayerBossHand();
      }

      closeCardModal();
    });

    cardModal.appendChild(discardButton);
  }

}

function closeCardModal() {
  cardModal.classList.remove("active");
  cardModalImg.src = "";

  const oldBattleButton = cardModal.querySelector(".battle-button");
  if (oldBattleButton) oldBattleButton.remove();

  const oldDiscardButton = cardModal.querySelector(".discard-button");
  if (oldDiscardButton) oldDiscardButton.remove();

  const oldAllyButton = cardModal.querySelector(".ally-button");
  if (oldAllyButton) oldAllyButton.remove();
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

    slot.onclick = () => openCardModal(card.face, {
      showDiscardButton: true,
      discardType: "tactic",
      cardIndex: index,
    });
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

function renderPlayerAllyBoss() {
  playerAllySlot.innerHTML = "";

  if (!playerAllyBoss) {
    playerAllySlot.classList.remove("has-ally");
    playerAllySlot.onclick = null;
    return;
  }

  playerAllySlot.classList.add("has-ally");

  const img = document.createElement("img");
  img.src = playerAllyBoss.face;
  img.alt = `chefe-aliado-${padNumber(playerAllyBoss.id)}`;

  playerAllySlot.appendChild(img);

  playerAllySlot.onclick = () => openCardModal(playerAllyBoss.face);
}

function renderPlayerBossHand() {
  playerBossCards.forEach((slot, index) => {
    const card = playerBossHand[index];

    if (!card) {
      slot.removeAttribute("src");
      slot.style.visibility = "hidden";
      slot.onclick = null;
      return;
    }

    slot.src = card.face;
    slot.style.visibility = "visible";

    slot.onclick = () => {
      selectedBossForBattle = card;
      selectedBossForBattleIndex = index;

      openCardModal(card.face, {
        showBattleButton: isChoosingBossForBattle,
        showDiscardButton: true,
        discardType: "boss",
        cardIndex: index,
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
  playerEnergyValue++;
  updateEnergyDisplays();

  isChoosingBossForBattle = true;
  selectedBossForBattle = null;
});

battleModalClose.addEventListener("click", () => {
  battleModal.classList.remove("active");
  resetBattleModal();
});

document
  .getElementById("clearAttributeNotes")
  .addEventListener("click", () => {

    document.querySelectorAll(".attribute-note").forEach((note) => {
      note.textContent = "0";
    });

    currentAttributeNoteIndex = 0;
  });

  switchPlayerButton.addEventListener("click", swapPlayers);

  function openSettingsModal() {
  settingsModal.classList.add("active");
}

function closeSettingsModal() {
  settingsModal.classList.remove("active");
}

settingsButton.addEventListener("click", openSettingsModal);

settingsModalClose.addEventListener("click", closeSettingsModal);

settingsModal.addEventListener("click", (event) => {
  if (event.target === settingsModal) {
    closeSettingsModal();
  }
});

restartGameButton.addEventListener("click", () => {
  location.reload();
});

rulesButton.addEventListener("click", () => {
  alert("Em breve.");
});

creditsButton.addEventListener("click", () => {
  alert("Residentes");
});