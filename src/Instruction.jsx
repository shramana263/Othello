import React from 'react';

const Instruction = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold mb-4">Game Instructions</h2>
        <div className="max-h-96 overflow-y-auto">
          <p className="mb-4">
            Welcome to Othello! Here are the detailed instructions to play the game:
          </p>
          <h3 className="font-semibold mb-2">Objective:</h3>
          <p className="mb-4">
            The goal of Othello is to have the majority of your colored discs on the board at the end of the game.
          </p>
          <h3 className="font-semibold mb-2">Game Setup:</h3>
          <ul className="list-disc list-inside mb-4">
            <li>The game is played on an 8x8 board.</li>
            <li>Each player starts with two discs placed in the center of the board: one black and one white on each side.</li>
          </ul>
          <h3 className="font-semibold mb-2">How to Play:</h3>
          <ul className="list-disc list-inside mb-4">
            <li>Players take turns placing their discs on the board.</li>
            <li>A valid move must capture at least one of your opponent's discs.</li>
            <li>To capture discs, you must place your disc in a position where it "sandwiches" one or more of your opponent's discs between your new disc and another disc of your color.</li>
            <li>When you make a valid move, all opponent's discs that are captured will be flipped to your color.</li>
            <li>If a player cannot make a valid move, they must pass their turn.</li>
          </ul>
          <h3 className="font-semibold mb-2">Valid Moves:</h3>
          <p className="mb-4">
            A move is valid if:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>The chosen cell is empty.</li>
            <li>At least one opponent's disc is captured in any direction (horizontal, vertical, or diagonal).</li>
          </ul>
          <h3 className="font-semibold mb-2">End of the Game:</h3>
          <p className="mb-4">
            The game ends when:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>All 64 squares on the board are filled.</li>
            <li>Neither player can make a valid move.</li>
          </ul>
          <h3 className="font-semibold mb-2">Winning the Game:</h3>
          <p className="mb-4">
            The player with the most discs of their color on the board at the end of the game wins. In case of a tie, the game is declared a draw.
          </p>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Instruction;