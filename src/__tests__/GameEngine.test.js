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


  describe('rotatePiece', () => {
    test('rotates the current piece clockwise', () => {
      // Set up a sample current piece
      gameEngine.currentPiece = {
        shape: [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        position: { x: 3, y: 0 },
      };

      // Rotate the piece clockwise
      gameEngine.rotatePiece();

      // Check if the piece's shape is rotated correctly
      expect(gameEngine.currentPiece.shape).toEqual([
        [0, 1, 1],
        [1, 1, 0],
      ]);

      // Rotate the piece clockwise again
      gameEngine.rotatePiece();

      // Check if the piece's shape is rotated correctly
      expect(gameEngine.currentPiece.shape).toEqual([
        [1, 0],
        [1, 1],
        [0, 1],
      ]);
    });

    test('rotates the I-shaped piece clockwise', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 1, 1, 1],
        ],
        position: { x: 3, y: 0 },
      };

      gameEngine.rotatePiece();

      expect(gameEngine.currentPiece.shape).toEqual([
        [1],
        [1],
        [1],
        [1],
      ]);

      gameEngine.rotatePiece();

      expect(gameEngine.currentPiece.shape).toEqual([
        [1, 1, 1, 1],
      ]);
    });

    test('rotates the T-shaped piece clockwise', () => {
      gameEngine.currentPiece = {
        shape: [
          [0, 1, 0],
          [1, 1, 1],
        ],
        position: { x: 3, y: 0 },
      };

      gameEngine.rotatePiece();

      expect(gameEngine.currentPiece.shape).toEqual([
        [1, 0],
        [1, 1],
        [1, 0],
      ]);
    });
    test('rotates the current piece counterclockwise', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 0],
          [1, 1],
          [0, 1],
        ],
        position: { x: 3, y: 0 },
      };

      gameEngine.rotatePiece(false);

      expect(gameEngine.currentPiece.shape).toEqual([
        [0, 1, 1],
        [1, 1, 0],
      ]);

      gameEngine.rotatePiece(false);

      expect(gameEngine.currentPiece.shape).toEqual([
        [1, 0],
        [1, 1],
        [0, 1],
      ]);
    });

    test('does not move the piece off the board to the left', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 1],
          [1, 1],
        ],
        position: { x: 0, y: 0 },
      };

      gameEngine.movePiece('left');

      expect(gameEngine.currentPiece.position.x).toBe(0);
    });

    test('does not move the piece off the board to the right', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 1],
          [1, 1],
        ],
        position: { x: 8, y: 0 },
      };

      gameEngine.movePiece('right');

      expect(gameEngine.currentPiece.position.x).toBe(8);
    });

    test('does not move the I-shaped piece off the board to the left', () => {
      gameEngine.currentPiece = {
        shape: [[1, 1, 1, 1]],
        position: { x: 0, y: 0 },
      };

      gameEngine.movePiece('left');

      expect(gameEngine.currentPiece.position.x).toBe(0);
    });

    test('does not move the I-shaped piece off the board to the right', () => {
      gameEngine.currentPiece = {
        shape: [[1, 1, 1, 1]],
        position: { x: 6, y: 0 },
      };

      gameEngine.movePiece('right');

      expect(gameEngine.currentPiece.position.x).toBe(6);
    });


    test('does not move the T-shaped piece off the board to the left', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 1, 1],
          [0, 1, 0],
        ],
        position: { x: 0, y: 0 },
      };

      gameEngine.movePiece('left');

      expect(gameEngine.currentPiece.position.x).toBe(0);
    });

    test('does not move the T-shaped piece off the board to the right', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 1, 1],
          [0, 1, 0],
        ],
        position: { x: 7, y: 0 },
      };

      gameEngine.movePiece('right');

      expect(gameEngine.currentPiece.position.x).toBe(7);
    });

    test('stops the piece from moving down when it collides with the bottom of the board', () => {
      gameEngine.currentPiece = {
        shape: [
          [1, 1],
          [1, 1],
        ],
        position: { x: 0, y: 18 },
      };

      gameEngine.movePiece('down');

      expect(gameEngine.currentPiece.position.y).toBe(18);
    });
  });
});
