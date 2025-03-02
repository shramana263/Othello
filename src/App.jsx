import { useState, useEffect } from 'react';

const App = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [initialized, setInitialized] = useState(false);

  // Initialize board
  useEffect(() => {
    const initialBoard = Array(8).fill().map(() => Array(8).fill(null));
    initialBoard[3][3] = 'white';
    initialBoard[3][4] = 'black';
    initialBoard[4][3] = 'black';
    initialBoard[4][4] = 'white';
    setBoard(initialBoard);
    setInitialized(true);
  }, []);

  // Check valid moves
  const isValidMove = (board, player, row, col) => {
    if (board[row][col] !== null) return false;
    
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let foundOpponent = false;

      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        if (board[x][y] === null) break;
        if (board[x][y] === player) {
          if (foundOpponent) return true;
          break;
        } else {
          foundOpponent = true;
        }
        x += dx;
        y += dy;
      }
    }
    return false;
  };

  // Flip discs in all valid directions
  const flipDiscs = (board, player, row, col) => {
    const newBoard = board.map(row => [...row]);
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    directions.forEach(([dx, dy]) => {
      let x = row + dx;
      let y = col + dy;
      const discsToFlip = [];

      while (x >= 0 && x < 8 && y >= 0 && y < 8) {
        if (newBoard[x][y] === null) break;
        if (newBoard[x][y] === player) {
          discsToFlip.forEach(([fx, fy]) => {
            newBoard[fx][fy] = player;
          });
          break;
        } else {
          discsToFlip.push([x, y]);
        }
        x += dx;
        y += dy;
      }
    });

    return newBoard;
  };

  // Handle cell click
  const handleClick = (row, col) => {
    if (gameOver || !isValidMove(board, currentPlayer, row, col)) return;

    const newBoard = flipDiscs(board, currentPlayer, row, col);
    newBoard[row][col] = currentPlayer;
    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'black' ? 'white' : 'black');
  };

  // Calculate scores
  useEffect(() => {
    let black = 0;
    let white = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell === 'black') black++;
        if (cell === 'white') white++;
      });
    });
    setScores({ black, white });
  }, [board]);

  // Check game over
  useEffect(() => {
    if (!initialized) return;

    let blackMoves = false;
    let whiteMoves = false;

    board.forEach((row, i) => {
      row.forEach((_, j) => {
        if (isValidMove(board, 'black', i, j)) blackMoves = true;
        if (isValidMove(board, 'white', i, j)) whiteMoves = true;
      });
    });

    const isGameOver = !blackMoves && !whiteMoves;
    setGameOver(isGameOver);

    if (!isGameOver) {
      if (currentPlayer === 'black' && !blackMoves) {
        setCurrentPlayer('white');
      } else if (currentPlayer === 'white' && !whiteMoves) {
        setCurrentPlayer('black');
      }
    }
  }, [currentPlayer, board, initialized]);

  // Reset game
  const resetGame = () => {
    const initialBoard = Array(8).fill().map(() => Array(8).fill(null));
    initialBoard[3][3] = 'white';
    initialBoard[3][4] = 'black';
    initialBoard[4][3] = 'black';
    initialBoard[4][4] = 'white';
    setBoard(initialBoard);
    setCurrentPlayer('black');
    setGameOver(false);
    setScores({ black: 2, white: 2 });
    setInitialized(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-2xl font-bold text-gray-800">
        {gameOver ? 'Game Over! ' : `Current Player: ${currentPlayer}`}
        {gameOver && `Winner: ${scores.black > scores.white ? 'Black' : scores.white > scores.black ? 'White' : 'Draw'}`}
      </div>
      
      <div className="mb-4 flex gap-4">
        <div className="bg-black text-white p-2 rounded-lg shadow-md min-w-[100px] text-center">
          Black: {scores.black}
        </div>
        <div className="bg-white text-black p-2 rounded-lg border-2 border-gray-300 shadow-md min-w-[100px] text-center">
          White: {scores.white}
        </div>
      </div>

      <div className="relative bg-amber-900 p-6 rounded-xl shadow-2xl">
        {/* Column labels */}
        <div className="absolute -top-6 left-0 right-0 flex justify-between px-4 text-gray-600 font-mono">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, i) => (
            <span key={label} className="w-12 text-center">{label}</span>
          ))}
        </div>
        
        {/* Row labels */}
        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between py-4 text-gray-600 font-mono">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <span key={num} className="h-12 flex items-center justify-center">{num}</span>
          ))}
        </div>

        <div className="grid grid-cols-8 gap-1 bg-amber-800 p-1 rounded-lg">
          {board.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  w-12 h-12 flex items-center justify-center
                  bg-amber-700/80 hover:bg-amber-700/90 transition-colors
                  ${isValidMove(board, currentPlayer, i, j) ? 'cursor-pointer' : 'cursor-default'}
                  ${(i + j) % 2 === 0 ? 'bg-amber-700/70' : 'bg-amber-700/90'}
                  relative
                `}
                onClick={() => handleClick(i, j)}
              >
                {cell && (
                  <div className={`
                    w-10 h-10 rounded-full shadow-lg
                    ${cell === 'black' ? 
                      'bg-gray-900 shadow-gray-800/50' : 
                      'bg-gray-50 shadow-gray-300/50'}
                    transform transition-all duration-300
                    hover:scale-105
                  `} />
                )}
                {isValidMove(board, currentPlayer, i, j) && !cell && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3 h-3 bg-gray-400/30 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))
          ))}
        </div>

        {/* Bottom column labels */}
        <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-4 text-gray-600 font-mono">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, i) => (
            <span key={label} className="w-12 text-center">{label}</span>
          ))}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg 
                 shadow-md hover:bg-blue-600 transition-colors
                 hover:shadow-lg active:scale-95"
      >
        Reset Game
      </button>
    </div>
  );
};

export default App;