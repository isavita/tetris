// GameEngine.js
export default class GameEngine {
  constructor() {
    this.board = this.createEmptyBoard();
    this.currentPiece = null;
    this.nextPiece = null;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
  }

  createEmptyBoard() {
    const rows = 20;
    const columns = 10;
    return Array(rows).fill(null).map(() => Array(columns).fill(0));
  }

  movePiece(direction) {
    const { x, y } = this.currentPiece.position;

    switch (direction) {
      case 'left':
        this.currentPiece.position.x = x - 1;
        break;
      case 'right':
        this.currentPiece.position.x = x + 1;
        break;
      case 'down':
        this.currentPiece.position.y = y + 1;
        break;
      default:
        break;
    }
  }

  rotatePiece(clockwise = true) {
    const rotatedShape = [];
    const rows = this.currentPiece.shape.length;
    const cols = this.currentPiece.shape[0].length;

    if (clockwise) {
      for (let col = 0; col < cols; col++) {
        const newRow = [];
        for (let row = rows - 1; row >= 0; row--) {
          newRow.push(this.currentPiece.shape[row][col]);
        }
        rotatedShape.push(newRow);
      }
    } else {
      for (let col = cols - 1; col >= 0; col--) {
        const newRow = [];
        for (let row = 0; row < rows; row++) {
          newRow.push(this.currentPiece.shape[row][col]);
        }
        rotatedShape.push(newRow);
      }
    }

    this.currentPiece.shape = rotatedShape;
  }
}
