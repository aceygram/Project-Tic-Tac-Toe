function Gameboard ()  {
    const rows = 3;
    const columns = 3;
    const gameBoard = [];
 
 //    const container = document.querySelector('.container');
 //    const boxes = Array.from(container.querySelectorAll('.boxes'));
 
 
    for (let i = 0; i < rows; i++) {
        gameBoard[i] = [];
        for (let j = 0; j < columns; j++) {
            gameBoard[i].push(block());
        }
    }

    const getBoard = () => gameBoard;

    const dropToken = (column, row, player) => {
        const targetCell = gameBoard[row][column];
    
        if (targetCell.getValue() !== '') return;
    
        targetCell.addMarker(player);
    };

    const resetBoard = () => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
            gameBoard[i][j].addMarker('');
            }
        }
    };

    
    const printBoard = () => {
        const boardWithCellValues = gameBoard.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    
return{
    getBoard,
    dropToken,
    printBoard,
    resetBoard
};
};

function block (){
    let value = '';

    const addMarker = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        addMarker,
        getValue,
    }
};
 
function displayController (
    playerOneName = "Player One",
    playerTwoName = "Player Two"
){
    const board = Gameboard();
    
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

    let activePlayer = players[0];

    const switchPlayerTurn = () =>{
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };
    
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

    const playRound = (column, row) => {
        console.log(`${getActivePlayer().name}'s marker is on column ${column} and row ${row}`);
    
        board.dropToken(column, row, getActivePlayer().marker);

        // Check for a win condition
        const boardData = board.getBoard();
        const activePlayerMarker = getActivePlayer().marker;
    

        if (checkWin(boardData, activePlayerMarker)) {
            //    console.log(`${getActivePlayer().name} wins!`);
            // Perform any necessary actions when a player wins
            // For example, show a message or reset the game
            return;
        }

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        resetBoard: board.resetBoard,
        checkWin
    }; 
};
 
function ScreenController() {
    const game = displayController();
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const reset = document.createElement('button');
    const resetboard = game.resetBoard;

     
    const updateScreen = () => {
       // clear the board
       boardDiv.textContent = "";

        // get the newest version of the board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();
        const activePlayerMarker = game.getActivePlayer().marker;
        const checkWin = game.checkWin;
       
        if (checkWin(board, activePlayerMarker)) {
           console.log(`${game.getActivePlayer().name} wins!`);
           // Perform any necessary actions when a player wins
           // For example, show a message or reset the game
           playerTurnDiv.textContent = `${activePlayer.name} has won the match`
 
             reset.textContent = 'Reset';
             reset.classList.add('reset');
             boardDiv.appendChild(reset);
             boardDiv.classList.remove('board-layout');
             boardDiv.classList.add('board-reset');

        } else {
            // Display player's turn
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
    
    game.playRound(selectedColumn, selectedRow);
    updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    reset.addEventListener('click', () =>{
    resetboard();
    updateScreen();
    });

    // Initial render
    updateScreen();
    // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
}
   
ScreenController();

// function Gameboard() {
//   const rows = 6;
//   const columns = 7;
//   const board = [];

//   for (let i = 0; i < rows; i++) {
//     board[i] = [];
//     for (let j = 0; j < columns; j++) {
//       board[i].push(Cell());
//     }
//   }

//   const getBoard = () => board;

//   const dropToken = (column, player) => {
//     const availableCells = board.filter((row) => row[column].getValue() === 0).map(row => row[column]);

//     if (!availableCells.length) return;

//     const lowestRow = availableCells.length - 1;
//     board[lowestRow][column].addToken(player);
//   };

//   const printBoard = () => {
//     const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
//     console.log(boardWithCellValues);
//   };

//   return { getBoard, dropToken, printBoard };
// }

// function Cell() {
//   let value = 0;

//   const addToken = (player) => {
//     value = player;
//   };

//   const getValue = () => value;

//   return {
//     addToken,
//     getValue
//   };
// }

// function GameController(
//   playerOneName = "Player One",
//   playerTwoName = "Player Two"
// ) {
//   const board = Gameboard();

//   const players = [
//     {
//       name: playerOneName,
//       token: 1
//     },
//     {
//       name: playerTwoName,
//       token: 2
//     }
//   ];

//   let activePlayer = players[0];

//   const switchPlayerTurn = () => {
//     activePlayer = activePlayer === players[0] ? players[1] : players[0];
//   };
//   const getActivePlayer = () => activePlayer;

//   const printNewRound = () => {
//     board.printBoard();
//     console.log(`${getActivePlayer().name}'s turn.`);
//   };

//   const playRound = (column) => {
//     console.log(
//       `Dropping ${getActivePlayer().name}'s token into column ${column}...`
//     );
//     board.dropToken(column, getActivePlayer().token);

//     /*  This is where we would check for a winner and handle that logic,
//         such as a win message. */

//     switchPlayerTurn();
//     printNewRound();
//   };

//   printNewRound();

//   return {
//     playRound,
//     getActivePlayer,
//     getBoard: board.getBoard
//   };
// }

// function ScreenController() {
//   const game = GameController();
//   const playerTurnDiv = document.querySelector('.turn');
//   const boardDiv = document.querySelector('.board');

//   const updateScreen = () => {
//     // clear the board
//     boardDiv.textContent = "";

//     // get the newest version of the board and player turn
//     const board = game.getBoard();
//     const activePlayer = game.getActivePlayer();

//     // Display player's turn
//     playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

//     // Render board squares
//     board.forEach(row => {
//       row.forEach((cell, index) => {
//         // Anything clickable should be a button!!
//         const cellButton = document.createElement("button");
//         cellButton.classList.add("cell");
//         // Create a data attribute to identify the column
//         // This makes it easier to pass into our `playRound` function 
//         cellButton.dataset.column = index
//         cellButton.textContent = cell.getValue();
//         boardDiv.appendChild(cellButton);
//       })
//     })
//   }

//   // Add event listener for the board
//   function clickHandlerBoard(e) {
//     const selectedColumn = e.target.dataset.column;
//     // Make sure I've clicked a column and not the gaps in between
//     if (!selectedColumn) return;
    
//     game.playRound(selectedColumn);
//     updateScreen();
//   }
//   boardDiv.addEventListener("click", clickHandlerBoard);

//   // Initial render
//   updateScreen();

//   // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
// }

// ScreenController();




















// function Gameboard ()  {
//     const rows = 3;
//     const columns = 3;
//     const gameBoard = [];
 
//  //    const container = document.querySelector('.container');
//  //    const boxes = Array.from(container.querySelectorAll('.boxes'));
 
 
//      for (let i = 0; i < rows; i++) {
//          gameBoard[i] = [];
//          for (let j = 0; j < columns; j++) {
//              gameBoard[i].push(block());
//          }
//      }
 
//      const getBoard = () => gameBoard;
 
//      const dropToken = (column, row, player) => {
//          const targetCell = gameBoard[row][column];
       
//          if (targetCell.getValue() !== '') return;
       
//          targetCell.addMarker(player);
//      };
     
//      const printBoard = () => {
//          const boardWithCellValues = gameBoard.map((row) => row.map((cell) => cell.getValue()))
//          console.log(boardWithCellValues);
//      };
     
//     return{
//      getBoard,
//      dropToken,
//      printBoard
//      // _render: _render
//     };
//  };
 
//  function block (){
//      let value = '';
 
//      const addMarker = (player) => {
//          value = player;
//      };
 
//      const getValue = () => value;
 
//      return {
//          addMarker,
//          getValue,
//      }
//  };
 
//  function displayController (
//      playerOneName = "Player One",
//      playerTwoName = "Player Two"
//  ){
//      const board = Gameboard();
     
//      const players = [
//          {
//              name: playerOneName,
//              marker: "X"
//          },
//          {
//              name: playerTwoName,
//              marker: "O"
//          }
//      ];
 
//      let activePlayer = players[0];
 
//      const switchPlayerTurn = () =>{
//          activePlayer = activePlayer === players[0] ? players[1] : players[0];
//      };
 
//      const getActivePlayer = () => activePlayer;
 
//      const printNewRound = () => {
//          board.printBoard();
//          console.log(`${getActivePlayer().name}'s turn.`);
//      };
       
//        // Helper function to check for a win condition
//      const checkWin = (boardData, marker) => {
//          const rows = boardData.length;
//          const columns = boardData[0].length;
       
         
//          // Check rows
//          for (let i = 0; i < rows; i++) {
//            if (
//              boardData[i][0].getValue() === marker &&
//              boardData[i][1].getValue() === marker &&
//              boardData[i][2].getValue() === marker
//            ) {
//              return true;
//            }
//          }
       
//          // Check columns
//          for (let i = 0; i < columns; i++) {
//            if (
//              boardData[0][i].getValue() === marker &&
//              boardData[1][i].getValue() === marker &&
//              boardData[2][i].getValue() === marker
//            ) {
//              return true;
//            }
//          }
       
//          // Check diagonals
//          if (
//            (boardData[0][0].getValue() === marker &&
//              boardData[1][1].getValue() === marker &&
//              boardData[2][2].getValue() === marker) ||
//            (boardData[0][2].getValue() === marker &&
//              boardData[1][1].getValue() === marker &&
//              boardData[2][0].getValue() === marker)
//          ) {
//            return true;
//          }
       
//          return false;
//      };
 
//      const playRound = (column, row) => {
//          console.log(`${getActivePlayer().name}'s marker is on column ${column} and row ${row}`);
     
//          board.dropToken(column, row, getActivePlayer().marker);
 
//           // Check for a win condition
//           const boardData = board.getBoard();
//           const activePlayerMarker = getActivePlayer().marker;
        
 
//              if (checkWin(boardData, activePlayerMarker)) {
//                  //    console.log(`${getActivePlayer().name} wins!`);
//                     // Perform any necessary actions when a player wins
//                     // For example, show a message or reset the game
//                     return;
//                   }
 
//          switchPlayerTurn();
//          printNewRound();
//      };
 
//      printNewRound();
 
//      return {
//          playRound,
//          getActivePlayer,
//          getBoard: board.getBoard,
//          checkWin
//      };
//  };
 
//  function ScreenController() {
//      const game = displayController();
//      const playerTurnDiv = document.querySelector('.turn');
//      const boardDiv = document.querySelector('.board');
//      const reset = document.createElement('button');
 
   
//      const updateScreen = () => {
//        // clear the board
//        boardDiv.textContent = "";
   
//        // get the newest version of the board and player turn
//        const board = game.getBoard();
//        const activePlayer = game.getActivePlayer();
//        const activePlayerMarker = game.getActivePlayer().marker;
//        const checkWin = game.checkWin;
       
//          if (checkWin(board, activePlayerMarker)) {
//            console.log(`${game.getActivePlayer().name} wins!`);
//            // Perform any necessary actions when a player wins
//            // For example, show a message or reset the game
//            playerTurnDiv.textContent = `${activePlayer.name} has won the match`
 
//              reset.textContent = 'Reset';
//              reset.classList.add('reset');
//              boardDiv.appendChild(reset);
//              boardDiv.classList.remove('board-layout');
//              boardDiv.classList.add('board-reset');
//          } else {
//                    // Display player's turn
//              playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
//              boardDiv.classList.remove('board-reset');
//              boardDiv.classList.add('board-layout');      
             
//              // Render board squares
//              board.forEach((row, rowIndex) => {
//                  row.forEach((cell, columnIndex) => {
//                  // Anything clickable should be a button!!
//                  const cellButton = document.createElement("button");
//                  cellButton.classList.add("cell");
//                  // Create data attributes to identify the column and row
//                  cellButton.dataset.column = columnIndex;
//                  cellButton.dataset.row = rowIndex;
//                  cellButton.textContent = cell.getValue();
//                  boardDiv.appendChild(cellButton);
//                  });
//              });
//          }
   
 
   
      
//      }
   
//      // Add event listener for the board
//      function clickHandlerBoard(e) {
//        const selectedColumn = e.target.dataset.column;
//        const selectedRow = e.target.dataset.row;
 
//        // Make sure I've clicked a column and not the gaps in between
//        if (!selectedColumn) return;
       
//        game.playRound(selectedColumn, selectedRow);
//        updateScreen();
//      }
//      boardDiv.addEventListener("click", clickHandlerBoard);
//      reset.addEventListener('click', ScreenController);
   
//      // Initial render
//      setTimeout(() => {
//          updateScreen();
//      }, 1000);
//      // We don't need to return anything from this module because everything is encapsulated inside this screen controller.
//  }
   
//    ScreenController();