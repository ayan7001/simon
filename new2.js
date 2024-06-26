"use strict";
const btnStart = document.querySelector(`#start-game`);
const numbersDatabase = new Map();
const playerStatus = {
  level: 1,
  position: 1,
  justStarted: false,
  rightGuess: false,
};
let highestLevel =
  localStorage.getItem("highestLevel") > playerStatus.level
    ? localStorage.getItem("highestLevel")
    : playerStatus.level;

function writeHighestLevel() {
  if (playerStatus.level > highestLevel) {
    highestLevel = playerStatus.level;
    localStorage.setItem("highestLevel", highestLevel);
  }
  document.querySelector("#hl").textContent = `Highest level: ${highestLevel}`;
}
writeHighestLevel();
const newNumber = function ({ level, rightGuess }) {
  setTimeout(function () {
    if (level === 0 || rightGuess === true) {
      const n = Math.round(Math.random() * 3 + 1);
      numbersDatabase.set(playerStatus[`level`], n);
      playAudio(n, rightGuess);
      highlightButton(n, false);
      return n;
    }
  }, 1100);
};
btnStart.addEventListener(`click`, function () {
  setTimeout(function () {
    document.querySelector(`body`).classList.remove(`game-over`);
    resetCSS();
    playerStatus.level = 1;
    playerStatus.position = 1;
    numbersDatabase.clear();

    const n = Math.round(Math.random() * 3 + 1);
    numbersDatabase.set(playerStatus[`level`], n);
    playAudio(n, true);
    highlightButton(n, true);
    showLevel();

    writeHighestLevel();
  }, 400);
});
const allButtons = new Map([
  [1, document.querySelector(`#green`)],
  [2, document.querySelector(`#red`)],
  [3, document.querySelector(`#yellow`)],
  [4, document.querySelector(`#blue`)],
]);

for (let i = 1; i <= allButtons.size; i++) {
  allButtons.get(i).addEventListener(`click`, function () {
    playAudio(i, checkAnswer(i));
    highlightButton(i, false);
  });
}

let i = 0;
function checkAnswer(buttonNumber) {
  if (buttonNumber === numbersDatabase.get(playerStatus.position)) {
    i++;
    playerStatus.position += 1;

    if (playerStatus.position > playerStatus.level) {
      playerStatus.level += 1;
      playerStatus.position = 1;
      i = 0;
      playerStatus.rightGuess = true;
      newNumber(playerStatus);
      showLevel();
    }
    return true;
  } else {
    playerStatus.rightGuess = false;
    gameOver(buttonNumber);

    writeHighestLevel();
    return false;
  }
}

//visual and sound operations
const widthOfScreen = document.querySelector(`html`).clientWidth;
const heightOfScreen = document.querySelector("html").clientHeight;
const knowMoreButton = document.querySelector("#know-more");
knowMore();
const audioGreen = new Audio("sounds/green.mp3");
const audioRed = new Audio("sounds/red.mp3");
const audioYellow = new Audio("sounds/yellow.mp3");
const audioBlue = new Audio("sounds/blue.mp3");
const wrongAudio = new Audio("sounds/wrong.mp3");
const audios = new Map([
  [1, audioGreen],
  [2, audioRed],
  [3, audioYellow],
  [4, audioBlue],
  [5, wrongAudio],
]);

knowMoreButton.addEventListener(`click`, function () {
  let presentAtb = knowMoreButton.getAttribute("clicked");
  knowMoreButton.setAttribute("clicked", presentAtb === "" ? "abcd" : "");
  knowMore();
});
function playAudio(key, rightGuess) {
  if (rightGuess) {
    audios.get(key).play();
  } else {
    audios.get(5).play();
  }
}

function highlightButton(key, makeInvisible) {
  if (makeInvisible) {
    allButtons.get(key).classList.add(`invisible`);
    setTimeout(function () {
      allButtons.get(key).classList.remove(`invisible`);
    }, 200);
  } else {
    allButtons.get(key).classList.add(`pressed`);
    setTimeout(function () {
      allButtons.get(key).classList.remove(`pressed`);
    }, 200);
  }
}
function gameOver(key) {
  allButtons.get(key).classList.add(`invisible`);
  document.querySelector(`body`).classList.add(`game-over`);
  document.querySelector(
    `#level-title`
  ).textContent = `lv:${playerStatus.level}|Try Again!`;
}

function resetCSS() {
  for (let i = 1; i <= allButtons.size; i++) {
    allButtons.get(i).classList.remove(`invisible`);
  }
}
function showLevel() {
  document.querySelector(
    `#level-title`
  ).textContent = `level ${playerStatus.level}`;
}
function knowMore() {
  const status = Boolean(knowMoreButton.getAttribute(`clicked`));

  if (status) {
    document.querySelector("#how-to-play").style.display = "block";
    document.querySelector("#game").classList.add("blur");
  } else {
    document.querySelector("#how-to-play").style.display = "none";
    document.querySelector("#game").classList.remove("blur");
  }
}
