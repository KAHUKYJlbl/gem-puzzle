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

for (let i = 0; i < GAME_SIZE; i++) {
  const cloneCell = cellTemplate.cloneNode(true);
  cloneCell.addEventListener('click', move);

  if (i === 0) {
    cloneCell.classList.add('empty');
  } else {
    cloneCell.classList.add('not-empty');
    cloneCell.textContent = getRandomCellNumber();
  }
  
  checkersFragment.append(cloneCell);
}

gameBoard.append(checkersFragment);

// GAME

const cells = Array.from(gameBoard.children);

function move(evt) {
  const targetCell = evt.currentTarget
  const positionTargetCell = cells.indexOf(targetCell);
  const emptyCell = gameBoard.querySelector('.empty');
  const positionEmptyCell = cells.indexOf(emptyCell);

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
  }

  // function isWin () {
  //   for (let i = 0; i < GAME_SIZE; i++) {

  //   }
  // }

  // if () {
  //   gameBoard
  // }
}