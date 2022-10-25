// UTILS
const GAME_SIZE = 16;

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

// START

const gameBoard = document.querySelector('.game-board');
const checkersFragment = document.createDocumentFragment();
const cellTemplate = document.querySelector('#cell')
  .content
  .querySelector('div');
const getRandomCellNumber = getUniqValue(getRandomInt, 1, GAME_SIZE - 1);
const movesDisplay = document.querySelector('.moves-number');

let moves = 0;
movesDisplay.textContent = moves;

for (let i = 0; i < GAME_SIZE; i++) {
  const cloneCell = cellTemplate.cloneNode(true);
  cloneCell.addEventListener('click', move);
  if (i == 1 || i == 4) {
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

gameBoard.append(checkersFragment);

const timerSpan = document.querySelector('.timer');
timerSpan.textContent = '00:00';
let gameTimer;

function newTimer (evt) {
  let time = 0;
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

// GAME

const cells = Array.from(gameBoard.children);

function move(evt) {
  const targetCell = evt.currentTarget
  const positionTargetCell = cells.indexOf(targetCell);
  const emptyCell = gameBoard.querySelector('.empty');
  const positionEmptyCell = cells.indexOf(emptyCell);

  if (gameTimer) {
    evt.target.removeEventListener('click', newTimer);
  }

  function isFirstColumn() {
    return (positionTargetCell === 0 || positionTargetCell === 4 || positionTargetCell === 8 || positionTargetCell === 12);
  }

  function isMoveLeft () {
    return positionTargetCell === positionEmptyCell + 1;
  }

  function isLastColumn () {
    return (positionTargetCell === 3 || positionTargetCell === 7 || positionTargetCell === 11 || positionTargetCell === 15);
  }

  function isMoveRight () {
    return positionTargetCell === positionEmptyCell - 1;
  }

  function isMoveUp () {
    return positionTargetCell === positionEmptyCell + 4;
  }

  function isMoveDown () {
    return positionTargetCell === positionEmptyCell - 4;
  }

  if ( isMoveUp() || isMoveDown() || (isMoveLeft() && !(isFirstColumn())) || (isMoveRight() && !(isLastColumn())) ) {
    emptyCell.classList.remove('empty');
    emptyCell.classList.add('not-empty');
    targetCell.classList.remove('not-empty');
    targetCell.classList.add('empty');
    emptyCell.textContent = targetCell.textContent;
    targetCell.textContent = '';
    moves++;
    movesDisplay.textContent = moves;
  }

  function isWin () {
    const winArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    let firstEmptyWin = true;
    let lastEmptyWin = true;
    for (let i = 0; i < GAME_SIZE - 1; i++) {
      if (+cells[i + 1].textContent !== winArr[i]) {
        firstEmptyWin = false;
      }
      if (+cells[i].textContent !== winArr[i]) {
        lastEmptyWin = false;
      } 
    }
    
    return (firstEmptyWin || lastEmptyWin);
  }

  if (isWin()) {
    alert(`Hooray! You solved the puzzle in ${timerSpan.textContent} and ${moves} moves!`);
    clearInterval(gameTimer);
  }
}