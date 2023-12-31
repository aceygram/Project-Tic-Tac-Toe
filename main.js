//created the main gameboard module where the necessary  functions that would interact with other modules
function Gameboard ()  {
    const rows = 3;
    const columns = 3;
    const gameBoard = [];

    //created a 2d 3x3 array table for the game 
    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameBoard[i].push(block());
        }
    }

    // function to get the gameboard array
    const getBoard = () => gameBoard;

    //created  a drop token function that inserts the player's marker to the rows and columns
    const dropToken = (column, row, player) => {
        const targetCell = gameBoard[row]?.[column];

        // Add boundary check to prevent accessing undefined elements
        if (!targetCell) return;
    
        if (targetCell.getValue() !== '') return;
    
        targetCell.addMarker(player);
    };

    // created a reset board function that erases the board when the reset button is used
    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
            gameBoard[i][j].addMarker('');
            }
        }
    };

    //A great app is one that can be played in the console.. this function prints the 2d 3x3 array cells on the console
    const printBoard = () => {
        const boardWithCellValues = gameBoard.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    
    return{
        getBoard,
        dropToken,
        printBoard,
        resetBoard,
    };
};

//created the block module to interact with the cells
function block (){
    //initialized te value to be an empty string
    let value = '';

    //function that adds marker 
    const addMarker = (player) => {
        value = player;
    };

    // function to get the value of cells
    const getValue = () => value;

    return {
        addMarker,
        getValue,
    }
};

function getPlayerNames (){
    addPlayerName.className = 'overlay'
    
    
    const playerOne = () =>{
        const player = firstPlayer.value;
        return player;
    }

    const playerTwo = () =>{
        const player =  secondPlayer.value;
        return player || 'AI';
    }


    return{
        playerOne,
        playerTwo,
    }
}

 
//created a display module which handles  and display the necessary game functions like to check win conditions, to switch players and initiate a new round playRound
function displayController (
    playerOneName = getPlayerNames().playerOne(),
    playerTwoName = getPlayerNames().playerTwo()
){
    // stored the gameboard function in a variable
    const board = Gameboard();

    // added an array with the player object and their marker
    const players = [
        {
            name: playerOneName,
            marker: "X"
        },
        {
            name: playerTwoName,
            marker: "O"
        }
    ];

    

    //made the player one the first active player
    let activePlayer = players[0];

    //created a function to switch players
    const switchPlayerTurn = () =>{
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    //created a function to get the active player
    const getActivePlayer = () => activePlayer;

    // created a new function to print new round after the previous player have made his move
    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
    //function to check if the boxes have been clicked already
    function checkIfBoxClicked(column, row) {
        const game = board.getBoard();
        // Add boundary checks to prevent accessing undefined elements
        if (
            row < 0 ||
            row >= game.length ||
            column < 0 ||
            column >= game[row].length
        ) {
            return false;
        }
        
        if (game[row][column].getValue() !== '') {
          return true;
        } else {
          return false;
        }
    }

    function allBoxesClicked(board) {
        // Iterate through each row in the board
        for (let row = 0; row < board.length; row++) {
          // Iterate through each cell in the row
          for (let cell = 0; cell < board[row].length; cell++) {
            // If any cell has not been clicked, return false
            if (board[row][cell].getValue() === '') {
              return false;
            }
          }
        }
        // If all cells have been clicked, return true
        return true;
      }

    // Helper function to check for a win condition
    const checkWin = (boardData, marker) => {
        const rows = boardData.length;
        const columns = boardData[0].length;
    
        
        // Check rows
        for (let i = 0; i < rows; i++) {
        if (
            boardData[i][0].getValue() === marker &&
            boardData[i][1].getValue() === marker &&
            boardData[i][2].getValue() === marker
        ) {
            return true;
        }
        }
    
        // Check columns
        for (let i = 0; i < columns; i++) {
        if (
            boardData[0][i].getValue() === marker &&
            boardData[1][i].getValue() === marker &&
            boardData[2][i].getValue() === marker
        ) {
            return true;
        }
        }
    
        // Check diagonals
        if (
        (boardData[0][0].getValue() === marker &&
            boardData[1][1].getValue() === marker &&
            boardData[2][2].getValue() === marker) ||
        (boardData[0][2].getValue() === marker &&
            boardData[1][1].getValue() === marker &&
            boardData[2][0].getValue() === marker)
        ) {
        return true;
        }
    
        return false;
    };

    function evaluate(board) {
        if (checkWin(board, players[1].marker)) {
          return 1;
        } else if (checkWin(board, players[0].marker)) {
          return -1;
        } else {
          return 0;
        }
      }
    
      function minimax(board, depth, maximizingPlayer) {
        const winner = evaluate(board);
        if (winner !== 0) {
          return winner * depth;
        }
    
        if (allBoxesClicked(board)) {
          return 0;
        }
    
        if (maximizingPlayer) {
          let maxEval = -Infinity;
          for (let row = 0; row < board.length; row++) {
            for (let cell = 0; cell < board[row].length; cell++) {
              if (board[row][cell].getValue() === '') {
                board[row][cell].addMarker(players[1].marker);
                const eval = minimax(board, depth + 1, false);
                board[row][cell].addMarker('');
                maxEval = Math.max(maxEval, eval);
              }
            }
          }
          return maxEval;
        } else {
          let minEval = Infinity;
          for (let row = 0; row < board.length; row++) {
            for (let cell = 0; cell < board[row].length; cell++) {
              if (board[row][cell].getValue() === '') {
                board[row][cell].addMarker(players[0].marker);
                const eval = minimax(board, depth + 1, true);
                board[row][cell].addMarker('');
                minEval = Math.min(minEval, eval);
              }
            }
          }
          return minEval;
        }
      }
    
      function findBestMove(board) {
        let bestEval = -Infinity;
        let bestMove = { row: -1, cell: -1 };
    
        for (let row = 0; row < board.length; row++) {
          for (let cell = 0; cell < board[row].length; cell++) {
            if (board[row][cell].getValue() === '') {
              board[row][cell].addMarker(players[1].marker);
              const eval = minimax(board, 0, false);
              board[row][cell].addMarker('');
              if (eval > bestEval) {
                bestEval = eval;
                bestMove = { row, cell };
              }
            }
          }
        }
    
        return bestMove;
      }

    //the playround function that displays error if a cell have been chosen, check if win conditions are met to trigger it, switch player then print new round
    const playRound = (column, row) => {
        // selected the error clas from the index.html file 
        const error = document.querySelector('.error');

        // check if the cell has already been clicked by either user and their marker has been dropped already
        if (checkIfBoxClicked(column, row)) {
            //displayed the error message
            error.textContent = 'Please select another box, this box has already been selected!';
            error.style.color = 'red';
        }else {
            // cleared the error message when the right cell has been selected
            error.textContent = '';
            console.log(`${getActivePlayer().name}'s marker is on column ${column} and row ${row}`);
            
            // dropped the necessary marker for the selected cell 
            board.dropToken(column, row, getActivePlayer().marker);

            // Check for a win condition
            const boardData = board.getBoard();
            const activePlayerMarker = getActivePlayer().marker;
    
            //return nothing when condition is met
            if (checkWin(boardData, activePlayerMarker)) {
                setTimeout(() => {

                }, 1000)
                return;
            } else if(allBoxesClicked(boardData)){
                switchPlayerTurn();
                return;
            };

            //switch player after the active player has made his move, also print a new round when the condition has been met
            switchPlayerTurn();
            printNewRound();
        }

        // if (activePlayer.name === 'AI') {
        //         setTimeout(() => {
        //             const { row, cell } = findBestMove(board.getBoard(), 1000);
        //             playRound(cell, row);
        //         }, 1000);
        //       }
    };
    // print new round when the screen controller is initially called 
    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard,
        checkWin,
        switchPlayerTurn,
        allBoxesClicked,
        evaluate,
        minimax,
        findBestMove,
        printNewRound
    }; 
};
 
//module to control what displays in the DOM
function ScreenController() {
    // imported and stored the display module in a variable
    const game = displayController();

    // selected elements from the DOM and create a reset button
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const reset = document.createElement('button');

    // get the latest version of the board with the reset function 
    const resetboard = game.resetBoard;

    // get the latest version of the board with the switch player function 
    const printNewRound = game.printNewRound;

    // function to update the screen every round 
    const updateScreen = () => {
       // clear the board
       boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const activePlayerMarker = game.getActivePlayer().marker;
        
        // get the lates version of the checkwin function 
        const checkWin = game.checkWin;

        // get the latest version of the board with the all boxes ticked function 
        const allBoxesClicked = game.allBoxesClicked;

        // get the latest version of the board with the switch player function 
        const switchPlayerTurn = game.switchPlayerTurn;
       
        // run the checkwin function then set the conditions
        if (checkWin(board, activePlayerMarker)) {
            // Function to show the code
            const showCode = () => {
                board.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                    // Anything clickable should be a button!!
                    const cellButton = document.createElement("button");
                    cellButton.classList.add("cell");
                    // Create data attributes to identify the column and row
                    cellButton.dataset.column = columnIndex;
                    cellButton.dataset.row = rowIndex;
                    cellButton.textContent = cell.getValue();
                    boardDiv.appendChild(cellButton);
                });
                });
            
                // Remove the code after 5 seconds
                setTimeout(() => {
                boardDiv.innerHTML = ''; // Remove the code by emptying the container element
                }, 1500);
            };
            
            // Call the showCode function to display the code
            showCode();
            
            setTimeout(() => {
                // display the winner on the console 
           console.log(`${game.getActivePlayer().name} wins!`);

           // display the winner on the DOM
           playerTurnDiv.textContent = `${activePlayer.name} has won the match`

           //set the content on the reset button, add a class to it
           reset.textContent = 'Reset';
           reset.classList.add('reset');

           //append the button to my board then remove and add the necessary class
           boardDiv.appendChild(reset);
           boardDiv.classList.add('board-reset');
           boardDiv.classList.remove('board-layout');
           switchPlayerTurn();
            }, 1500)
           
            return;
        } else if (allBoxesClicked(board)){
           // display the winner on the DOM
           playerTurnDiv.textContent = `It is a Tie`;

           // display tie in the dom
           console.log('It is a Tie!');


           //set the content on the reset button, add a class to it
           reset.textContent = 'Reset';
           reset.classList.add('reset');

           //append the button to my board then remove and add the necessary class
           boardDiv.appendChild(reset);
           boardDiv.classList.remove('board-layout');
           boardDiv.classList.add('board-reset');
           return;
        } else {
            // Display player's turn then remove and add the necessary class
            playerTurnDiv.textContent = `${activePlayer.name}'s turn, your marker is ${activePlayer.marker}`
            boardDiv.classList.remove('board-reset');
            boardDiv.classList.add('board-layout');
            
            // Render board squares
            board.forEach((row, rowIndex) => {
                row.forEach((cell, columnIndex) => {
                // Anything clickable should be a button!!
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                // Create data attributes to identify the column and row
                cellButton.dataset.column = columnIndex;
                cellButton.dataset.row = rowIndex;
                cellButton.textContent = cell.getValue();
                boardDiv.appendChild(cellButton);
                });
            });
        }

        if (activePlayer.name === 'AI') {
            setTimeout(() => {
                const { row, cell } = game.findBestMove(game.getBoard(), 1000);
                game.playRound(cell, row);
                updateScreen();
            }, 1500);
            return;
          }
    }
   
    // Add event listener for the board
    function clickHandlerBoard(e) {
      const selectedColumn = e.target.dataset.column;
      const selectedRow = e.target.dataset.row;

      // Make sure I've clicked a column and not the gaps in between
      if (!selectedColumn) return;

      // Check if it is AI's turn, if so, return without proceeding
      if (game.getActivePlayer().name === 'AI') return;

      //call the playround function with the selected column and row and update the screen
      game.playRound(selectedColumn, selectedRow);
      updateScreen();
    }
    // add event handlers for each cells clicked 
    boardDiv.addEventListener("click", clickHandlerBoard);

    //added event handler for the reset button,  call the reset function and the update screen function
    reset.addEventListener('click', () =>{
        resetboard();
        printNewRound();
        updateScreen();
    });

    // Initial render
    updateScreen();
}

const firstPlayer = document.getElementById('PlayerOne');
const secondPlayer = document.getElementById('PlayerTwo');
const addPlayerName = document.getElementById('addPlayerName');
const msg = document.querySelector('.msg');
const close = document.querySelector('.close');
  
close.addEventListener('click', () => {
  addPlayerName.className = 'form-hide';
  msg.textContent = '';
});

const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (firstPlayer.value === ''){
    msg.textContent = 'Player One input empty!';
  } else {
    ScreenController();
    addPlayerName.className = 'form-hide';
    firstPlayer.value = '';
    secondPlayer.value = '';
    msg.textContent = '';
  }
});


const start = document.querySelector('.start');
start.addEventListener("click", getPlayerNames)