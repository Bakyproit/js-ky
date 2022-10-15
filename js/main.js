import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import { 
    getCellElementAtIdx,
    getCellElementList, 
    getCellListElement, 
    getCurrentTurnElement, 
    getGameStatusElement,
    getReplayButtonElement
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

// console.log(checkGameStatus(['X', 'O', 'O', '', 'X', '', '', 'O', 'X'])) ;

/**
 * Global variables
 */
let currentTurn = TURN.CROSS ;
let gameStatus = GAME_STATUS.PLAYING ;
let isGameEnded = false;
let cellValues = new Array(9).fill("");

function toggleTurn(){
    currentTurn = currentTurn === TURN.CIRCLE ? TURN.CROSS : TURN.CIRCLE ;
    
    // UPDATE turn on DOM element
    const currentTurnElement = getCurrentTurnElement() ;
    if(currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CIRCLE , TURN.CROSS) ;
        currentTurnElement.classList.add(currentTurn) ;
    }

}
function updateGameStatus(newGameStatus){
    gameStatus = newGameStatus ;

    const gameStatusElement = getGameStatusElement() ; 
    if(gameStatusElement)  
       gameStatusElement.textContent = newGameStatus ;
}
function showReplayButton(){
    const replayButton = getReplayButtonElement() ;
    if(replayButton) replayButton.classList.add('show') ;
}
function hideReplayButton(){
    const replayButton = getReplayButtonElement() ;
    if(replayButton) replayButton.classList.remove('show') ;
}
function highlightWinCells(winPositions){
    if(!Array.isArray(winPositions) || winPositions.length !== 3) {
        throw new Error('Invalid win position') ;
    }
    
    for (const position of winPositions) {
        const cell = getCellElementAtIdx(position) ;
        if(cell) cell.classList.add('win') ;
    }

}

function handleCellClick(cell , index){
//    console.log('click' , cell, index) ;
   const isClicked = cell.classList.contains(TURN.CIRCLE) || cell.classList.contains(TURN.CROSS) ;
   const isEndGame = gameStatus !== GAME_STATUS.PLAYING ;
   // only allow to click
   if(isClicked || isEndGame) return ;
   
   // set selected cell
   cell.classList.add(currentTurn) ;
   // update cellValues
   cellValues[index] =
      currentTurn === TURN.CIRCLE ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS ;

   // toggle turn
   toggleTurn() ; 
   // check game status
   const game = checkGameStatus(cellValues) ;
   switch(game.status){
      case GAME_STATUS.ENDED : {
        //update game status
        updateGameStatus(game.status) ;
        // show replay button
        showReplayButton() ;
        break ;
      }
      case GAME_STATUS.O_WIN :
      case GAME_STATUS.X_WIN :{
        //update game status
        updateGameStatus(game.status) ;
        //show replay button
        showReplayButton() ;
        // highlighr win cells
        highlightWinCells(game.winPositions) ;
         break ;
      }
      default : 
      // playing
   }
}

function initCellElementList(){
    // li
//     const cellElemenList = getCellElementList() ;
//     cellElemenList.forEach((cell , index) => {
//         cell.addEventListener('click' , () => handleCellClick(cell,index)) ;
//     });
    const liList = getCellElementList() ;
    liList.forEach((cell , index) => {
         cell.dataset.idx = index ;
    });

    const ulElement = getCellListElement() ; 
    if(ulElement) {
        ulElement.addEventListener('click' , (event) => {
            if(event.target.tagName !== 'LI') return ;
            const index = Number.parseInt(event.target.dataset.idx) ;
            handleCellClick(event.target , index) ;
        })
    }
}

function resetGame(){
    // reset temp global vars
    currentTurn = TURN.CROSS ;
    gameStatus = GAME_STATUS.PLAYING ;
    cellValues = cellValues.map(() => '') ;
    // reset Dom 
    // reset game status
    updateGameStatus(GAME_STATUS.PLAYING) ;
    // reset current turn
    const currentTurnElement = getCurrentTurnElement() ;
    if(currentTurnElement) {
        currentTurnElement.classList.remove(TURN.CROSS , TURN.CIRCLE) ;
        currentTurnElement.classList.add(TURN.CROSS) ;
    }
    // reset game board
    const cellElemenList = getCellElementList() ;
    for (const cellElement of cellElemenList) {
        // cellElement.classList.remove(TURN.CROSS , TURN.CIRCLE) ;
        cellElement.className = '' ;
    }
    // hide replay button
    hideReplayButton() ;

}

function initReplayButton(){
    const replayButton = getReplayButtonElement() ;
    if(replayButton) {
        replayButton.addEventListener('click' , resetGame);
    }
}


(() => {
    // find click event for all li element
    initCellElementList() ;

    initReplayButton() ;
})();

// event delegation
