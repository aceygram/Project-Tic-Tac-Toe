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

    const askName = () =>{
        prompt('what is your name?');
    }

    // function to get the gameboard array
    const getBoard = () => gameBoard;

    //created  a drop token function that inserts the player's marker to the rows and columns
    const dropToken = (column, row, player) => {
        const targetCell = gameBoard[row][column];
    
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
        askName
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

function Players(){
    const playerOne = () =>{
        const player = prompt("what is the name for Player One?");
        return player;
    }

    const playerTwo = () =>{
        const player = prompt("what is the name for Player Two?");
        return player;
    }

    return{
        playerOne,
        playerTwo
    }
}

 
//created a display module which handles  and display the necessary game functions like to check win conditions, to switch players and initiate a new round playRound
function displayController (
    playerOneName = Players().playerOne(),
    playerTwoName = Players().playerTwo()
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
                return;
            } else if(allBoxesClicked(boardData)){
                switchPlayerTurn();
                return;
            };

            //switch player after the active player has made his move, also print a new round when the condition has been met
            switchPlayerTurn();
            printNewRound();
        }
        
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
        allBoxesClicked
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
            // display the winner on the console 
           console.log(`${game.getActivePlayer().name} wins!`);

           // display the winner on the DOM
           playerTurnDiv.textContent = `${activePlayer.name} has won the match`

           //set the content on the reset button, add a class to it
           reset.textContent = 'Reset';
           reset.classList.add('reset');

           //append the button to my board then remove and add the necessary class
           boardDiv.appendChild(reset);
           boardDiv.classList.remove('board-layout');
           boardDiv.classList.add('board-reset');
           switchPlayerTurn();

        } else if (allBoxesClicked(board)){
           // display the winner on the DOM
           playerTurnDiv.textContent = `It is a Tie`;

           //set the content on the reset button, add a class to it
           reset.textContent = 'Reset';
           reset.classList.add('reset');

           //append the button to my board then remove and add the necessary class
           boardDiv.appendChild(reset);
           boardDiv.classList.remove('board-layout');
           boardDiv.classList.add('board-reset');
        } else {
            // Display player's turn then remove and add the necessary class
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
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
    }
   
    // Add event listener for the board
    function clickHandlerBoard(e) {
        const selectedColumn = e.target.dataset.column;
        const selectedRow = e.target.dataset.row;

        // Make sure I've clicked a column and not the gaps in between
        if (!selectedColumn) return;

        //call the playround function with the selected column and row and update the screen
        game.playRound(selectedColumn, selectedRow);
        updateScreen();
    }
    // add event handlers for each cells clicked 
    boardDiv.addEventListener("click", clickHandlerBoard);

    //added event handler for the reset button,  call the reset function and the update screen function
    reset.addEventListener('click', () =>{
    resetboard();
    updateScreen();
    });

    // Initial render
    updateScreen();
}

const start = document.querySelector('.start');
start.addEventListener("click", ScreenController)