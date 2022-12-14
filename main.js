// UTILS

function getRandomInt(x, y) {
  if (Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0) {
    const min = Math.ceil(Math.min(x, y));
    const max = Math.floor(Math.max(x, y));
    const randomInt = Math.floor(Math.random() * (max - min + 1) + min);
    return (randomInt >= min && randomInt <= max) ? randomInt : null;
  }

  return NaN;
}

function getUniqValue (fn, ...args) {
  const cache = [];

  return function () {
    let value;

    do {
      value = fn(...args);
    } while ( cache.includes(value) );

    cache.push(value);
    return value;
  };
}
let time = 0;
function newTimer (evt) {
  let minutes = 0;
  let seconds = 0;

  function plusSecond() {
    timerSpan.textContent = `${(minutes < 10 ? '0' + minutes : minutes)}:${(seconds < 10 ? '0' + seconds : seconds)}`;
    time++;
    minutes = Math.floor(time / 60);
    seconds = time % 60;
  }

  gameTimer = setInterval(plusSecond, 1000);
}

let gameSize = 16;
const threeGame = document.querySelector('.three');
threeGame.addEventListener('click', () => {
  gameSize = 9;

  startGame();
});

const fourGame = document.querySelector('.four')
fourGame.addEventListener('click', () => {
  gameSize = 16;
  startGame();
});

const sixGame = document.querySelector('.six')
sixGame.addEventListener('click', () => {
  gameSize = 36;
  startGame();
});

const sevenGame = document.querySelector('.seven')
sevenGame.addEventListener('click', () => {
  gameSize = 49;
  startGame();
});

const eightGame = document.querySelector('.eight')
eightGame.addEventListener('click', () => {
  gameSize = 64;
  startGame();
});

const fiveGame = document.querySelector('.five')
fiveGame.addEventListener('click', () => {
  gameSize = 25;
  startGame();
});

const timerSpan = document.querySelector('.timer');
const gameBoard = document.querySelector('.game-board');
const movesDisplay = document.querySelector('.moves-number');
let gameTimer;
let moves = 0;

const nineGame = document.querySelector('.nine')
nineGame.addEventListener('click', () => {
  gameSize = 81;
  startGame();

  function minesweeper() {
    gameBoard.innerHTML = '';
    gameBoard.style.backgroundImage = `url("minesweeper.jpg")`;
    gameBoard.removeEventListener('click', minesweeper);
  }

  gameBoard.addEventListener('click', minesweeper);
});


// START

document.querySelector('.new-game').addEventListener('click', startGame);

function startGame () {
  gameBoard.style.backgroundImage = '';
  clearInterval(gameTimer);
  time = 0;
  moves = 0;

  const checkersFragment = document.createDocumentFragment();
  const cellTemplate = document.querySelector('#cell')
    .content
    .querySelector('div');
  const getRandomCellNumber = getUniqValue(getRandomInt, 1, gameSize - 1);

  movesDisplay.textContent = moves;

  for (let i = 0; i < gameSize; i++) {
    const cloneCell = cellTemplate.cloneNode(true);
    cloneCell.addEventListener('click', move);
    if (i == 1 || i == Math.sqrt(gameSize)) {
      cloneCell.addEventListener('click', newTimer);
    }

    if (i === 0) {
      cloneCell.classList.add('empty');
    } else {
      cloneCell.classList.add('not-empty');
      cloneCell.textContent = getRandomCellNumber();
    }
    
    checkersFragment.append(cloneCell);
  }

  gameBoard.innerHTML = '';
  gameBoard.style.gridTemplateColumns = `repeat(${Math.sqrt(gameSize)}, 1fr)`;
  gameBoard.style.gridTemplateRows = `repeat(${Math.sqrt(gameSize)}, 1fr)`;
  gameBoard.append(checkersFragment);

  timerSpan.textContent = '00:00';
}

// GAME

function move(evt) {
  const cells = Array.from(gameBoard.children);
  const targetCell = evt.currentTarget
  const positionTargetCell = cells.indexOf(targetCell);
  const emptyCell = gameBoard.querySelector('.empty');
  const positionEmptyCell = cells.indexOf(emptyCell);

  if (time > 0) {
    evt.target.removeEventListener('click', newTimer);
  }

  function isFirstColumn() {
    return (positionTargetCell === 0 || positionTargetCell === Math.sqrt(gameSize) || positionTargetCell === Math.sqrt(gameSize) * 2 || positionTargetCell === Math.sqrt(gameSize) * 3 || positionTargetCell === Math.sqrt(gameSize) * 4 || positionTargetCell === Math.sqrt(gameSize) * 5 || positionTargetCell === Math.sqrt(gameSize) * 6 || positionTargetCell === Math.sqrt(gameSize) * 7);
  }

  function isMoveLeft () {
    return positionTargetCell === positionEmptyCell + 1;
  }

  function isLastColumn () {
    return (positionTargetCell === Math.sqrt(gameSize) - 1 || positionTargetCell === Math.sqrt(gameSize) * 2 - 1 || positionTargetCell === Math.sqrt(gameSize) * 3 - 1 || positionTargetCell === Math.sqrt(gameSize) * 4 - 1 || positionTargetCell === Math.sqrt(gameSize) * 5 - 1 || positionTargetCell === Math.sqrt(gameSize) * 6 - 1 || positionTargetCell === Math.sqrt(gameSize) * 7 - 1 || positionTargetCell === Math.sqrt(gameSize) * 8 - 1);
  }

  function isMoveRight () {
    return positionTargetCell === positionEmptyCell - 1;
  }

  function isMoveUp () {
    return positionTargetCell === positionEmptyCell + Math.sqrt(gameSize);
  }

  function isMoveDown () {
    return positionTargetCell === positionEmptyCell - Math.sqrt(gameSize);
  }

  function hop () {
    emptyCell.classList.remove('empty');
    emptyCell.classList.add('not-empty');
    targetCell.classList.remove('not-empty');
    targetCell.classList.add('empty');
    emptyCell.textContent = targetCell.textContent;
    targetCell.textContent = '';
    moves++;
    movesDisplay.textContent = moves;
    emptyCell.classList.remove('animated');
    targetCell.classList.remove('animated');
    targetCell.style.transform = '';
    emptyCell.style.transform = '';
    // emptyCell.style.border = '1px solid grey';
  }

  if (isMoveUp()) {
    emptyCell.classList.add('animated');
    targetCell.classList.add('animated');
    // emptyCell.style.border = 'none';
    targetCell.style.transform = `translateY(${-384 / Math.sqrt(gameSize)}px)`;
    emptyCell.style.transform = `translateY(${384 / Math.sqrt(gameSize)}px)`;
    setTimeout(hop, 300);
  } else if (isMoveDown()) {
    emptyCell.classList.add('animated');
    targetCell.classList.add('animated');
    // emptyCell.style.border = 'none';
    targetCell.style.transform = `translateY(${384 / Math.sqrt(gameSize)}px)`;
    emptyCell.style.transform = `translateY(${-384 / Math.sqrt(gameSize)}px)`;
    setTimeout(hop, 300);
  } else if (isMoveLeft() && !(isFirstColumn())) {
    emptyCell.classList.add('animated');
    targetCell.classList.add('animated');
    // emptyCell.style.border = 'none';
    targetCell.style.transform = `translate(${-384 / Math.sqrt(gameSize)}px)`;
    emptyCell.style.transform = `translate(${384 / Math.sqrt(gameSize)}px)`;
    setTimeout(hop, 300);
  } else if (isMoveRight() && !(isLastColumn())) {
    emptyCell.classList.add('animated');
    targetCell.classList.add('animated');
    // emptyCell.style.border = 'none';
    targetCell.style.transform = `translateX(${384 / Math.sqrt(gameSize)}px)`;
    emptyCell.style.transform = `translateX(${-384 / Math.sqrt(gameSize)}px)`;
    setTimeout(hop, 300);
  }

  function isWin () {
    const winArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63];

    let firstEmptyWin = true;
    let lastEmptyWin = true;
    for (let i = 0; i < gameSize - 1; i++) {
      if (+cells[i + 1].textContent !== winArr[i]) {
        firstEmptyWin = false;
      }
      if (+cells[i].textContent !== winArr[i]) {
        lastEmptyWin = false;
      } 
    }
    
    return (firstEmptyWin || lastEmptyWin);
  }

  function checkHooray() {
    if (isWin()) {
      alert(`Hooray! You solved the puzzle in ${timerSpan.textContent} and ${moves} moves!`);
      clearInterval(gameTimer);
    }
  }

  setTimeout(checkHooray, 320);
}

startGame();