// GameEngine.test.js
import GameEngine from '../scenes/GameEngine.js';

describe('GameEngine', () => {
  let gameEngine;

  beforeEach(() => {
    gameEngine = new GameEngine();
  });

  test('initializes the game state correctly', () => {
    expect(gameEngine.board).toBeDefined();
    expect(gameEngine.currentPiece).toBeDefined();
    expect(gameEngine.nextPiece).toBeDefined();
    expect(gameEngine.score).toBe(0);
    expect(gameEngine.level).toBe(1);
    expect(gameEngine.linesCleared).toBe(0);
  });

  test('moves the current piece in the specified direction', () => {
    // Set up a sample current piece
    gameEngine.currentPiece = {
      shape: [
        [1, 1],
        [1, 1],
      ],
      position: { x: 3, y: 0 },
    };

    // Move the piece to the right
    gameEngine.movePiece('right');

    // Check if the piece's position is updated correctly
    expect(gameEngine.currentPiece.position.x).toBe(4);

    // Move the piece to the left
    gameEngine.movePiece('left');

    // Check if the piece's position is updated correctly
    expect(gameEngine.currentPiece.position.x).toBe(3);

    // Move the piece down
    gameEngine.movePiece('down');

    // Check if the piece's position is updated correctly
    expect(gameEngine.currentPiece.position.y).toBe(1);
  });
});
