import { useState, useEffect } from 'react';
import Instruction from './Instruction';

const Computer = () => {
  const [board, setBoard] = useState(Array(8).fill().map(() => Array(8).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('black');
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState({ black: 2, white: 2 });
  const [initialized, setInitialized] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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
    setCurrentPlayer('white'); // Switch to computer's turn
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

  // AI Move
  const computerMove = () => {
    let bestMove = null;
    let bestScore = -1;

    // Evaluate all possible moves for the computer
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (isValidMove(board, 'white', i, j)) {
          const newBoard = flipDiscs(board, 'white', i, j);
          newBoard[i][j] = 'white';
          const score = calculateScore(newBoard);
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      }
    }

    // Make the best move
    if (bestMove) {
      const newBoard = flipDiscs(board, 'white', bestMove.row, bestMove.col);
      newBoard[bestMove.row][bestMove.col] = 'white';
      setBoard(newBoard);
      setCurrentPlayer('black'); // Switch back to player's turn
    }
  };

  // Calculate score for the board
  const calculateScore = (board) => {
    let score = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell === 'white') score++;
        if (cell === 'black') score--;
      });
    });
    return score;
  };

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

  // Handle computer's turn
  useEffect(() => {
    if (currentPlayer === 'white' && !gameOver) {
      computerMove();
    }
  }, [currentPlayer]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="mb-4 text-3xl font-bold text-gray-800 font-serif text-center">
        {gameOver ? '🎮 Game Over! ' : `🕹️ Current Player: ${currentPlayer}`}
        {gameOver && `🏆 Winner: ${scores.black > scores.white ? 'Black' : scores.white > scores.black ? 'White' : 'Draw'}`}
      </div>

      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="bg-gray-900 text-white px-4 py-2 rounded-xl shadow-lg min-w-[100px] text-center border-2 border-gray-800">
          <div className="text-sm text-gray-300">Black</div>
          <div className="text-2xl font-bold">{scores.black}</div>
        </div>
        <div className="bg-white text-gray-900 px-4 py-2 rounded-xl shadow-lg min-w-[100px] text-center border-2 border-gray-200">
          <div className="text-sm text-gray-500">White</div>
          <div className="text-2xl font-bold">{scores.white}</div>
        </div>
      </div>

      <div className="relative bg-green-900 p-2 sm:p-4 rounded-2xl shadow-2xl mx-4 sm:mx-8">
        {/* Game board */}
        <div className="grid grid-cols-8 gap-1 bg-green-800 p-2 rounded-xl">
          {board.map((row, i) => (
            row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center
                  transition-all duration-200
                  ${isValidMove(board, currentPlayer, i, j) 
                    ? 'cursor-pointer hover:bg-green-700/90' 
                    : 'cursor-default'}
                  ${(i + j) % 2 === 0 ? 'bg-green-700/80' : 'bg-green-700/60'}
                  relative
                `}
                onClick={() => handleClick(i, j)}
              >
                {cell && (
                  <div className={`w-8 h-8 rounded-full ${cell === 'black' ? 'bg-black' : 'bg-white'}`}></div>
                )}
                {isValidMove(board, currentPlayer, i, j) && !cell && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-gray-100/30 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-4">
        <button
          onClick={resetGame}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition w-full sm:w-auto"
        >
          Reset Game
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full sm:w-auto"
        >
          Game Instructions
        </button>
      </div>

      <Instruction isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Computer;