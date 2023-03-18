let editPlayerIndex;
let activePlayerIndex;
let gameIsOver = false;
let gameBoardData = [
  ["-", "-", "-"],
  ["-", "-", "-"],
  ["-", "-", "-"],
];
const players = [
  { symbol: "X", name: "" },
  { symbol: "O", name: "" },
];

const player1Edit = document.getElementById("player-1__edit");
const player2Edit = document.getElementById("player-2__edit");

const modal = document.getElementById("modal");
const editPlayerForm = document.querySelector("#modal form");
const modalInputDiv = document.getElementById("modal-input");
const playerNameInput = document.getElementById("player-name");

const openModal = () => {
  playerNameInput.value = "";
  modalInputDiv.classList.remove("error");
  modal.style.display = "grid";
  playerNameInput.focus();
};

const closeModal = () => (modal.style.display = "none");

const onEditButtonClick = (event) => {
  openModal();
  editPlayerIndex = event.target.dataset.index;
};

player1Edit.addEventListener("click", onEditButtonClick);
player2Edit.addEventListener("click", onEditButtonClick);

const onEditPlayerFormSubmit = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const playerName = formData.get("player-name").trim();

  if (!playerName) {
    modalInputDiv.classList.add("error");
    return;
  }

  document.getElementById(`player-${+editPlayerIndex + 1}`).children[1].textContent = playerName;
  players[+editPlayerIndex].name = playerName;
  closeModal();
};

editPlayerForm.addEventListener("submit", onEditPlayerFormSubmit);
editPlayerForm.addEventListener("reset", closeModal);
playerNameInput.addEventListener("input", () => modalInputDiv.classList.remove("error"));

const startNewGame = document.getElementById("start-new-game");
const gameOver = document.getElementById("game-over");
const gameBoard = document.getElementById("game-board");

const cells = document.querySelectorAll("#game-board li");

const resetGame = () => {
  for (const cell of cells) {
    cell.textContent = "";
    cell.classList.remove("disabled");
  }
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      gameBoardData[i][j] = "-";
    }
  }
  gameOver.style.display = "none";
  gameIsOver = false;
};

const onStartNewGameClick = () => {
  if (players[0].name === "" || players[1].name === "") {
    alert("Please enter a valid name for both players.");
    return;
  }

  resetGame();

  activePlayerIndex = Math.floor(Math.random() * 2);
  gameBoard.firstElementChild.firstElementChild.textContent = players[activePlayerIndex].name;
  gameBoard.style.display = "block";
};

startNewGame.addEventListener("click", onStartNewGameClick);

const isThereAnyWinner = () => {
  for (let i = 0; i < 3; i++) {
    if (gameBoardData[i][0] !== "-" && gameBoardData[i][0] === gameBoardData[i][1] && gameBoardData[i][0] === gameBoardData[i][2]) {
      return gameBoardData[i][0];
    }

    if (gameBoardData[0][i] !== "-" && gameBoardData[0][i] === gameBoardData[1][i] && gameBoardData[0][i] === gameBoardData[2][i]) {
      return gameBoardData[0][i];
    }
  }

  if (gameBoardData[0][0] !== "-" && gameBoardData[0][0] === gameBoardData[1][1] && gameBoardData[0][0] === gameBoardData[2][2]) {
    return gameBoardData[0][0];
  }

  if (gameBoardData[2][0] !== "-" && gameBoardData[2][0] === gameBoardData[1][1] && gameBoardData[2][0] === gameBoardData[0][2]) {
    return gameBoardData[2][0];
  }

  return -1;
};

const isDraw = () => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (gameBoardData[i][j] === "-") return false;
    }
  }

  return true;
};

const endGame = () => {
  gameOver.style.display = "block";
  gameIsOver = true;

  for (const cell of cells) {
    cell.classList.add("disabled");
  }
};

const onCellClick = (event) => {
  if (event.target.textContent || gameIsOver) return;

  event.target.textContent = players[activePlayerIndex].symbol;
  gameBoardData[event.target.dataset.row][event.target.dataset.col] = activePlayerIndex;
  event.target.classList.add("disabled");

  const winnerIndex = isThereAnyWinner();
  if (winnerIndex !== -1) {
    gameOver.firstElementChild.textContent = `You won, ${players[winnerIndex].name}!`;
    endGame();
  } else if (isDraw()) {
    gameOver.firstElementChild.textContent = `It's a draw!`;
    endGame();
  } else {
    activePlayerIndex = activePlayerIndex === 0 ? 1 : 0;
    gameBoard.firstElementChild.firstElementChild.textContent = players[activePlayerIndex].name;
  }
};

for (const cell of cells) {
  cell.addEventListener("click", onCellClick);
}
