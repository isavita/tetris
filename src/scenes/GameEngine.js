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
    const cols = this.currentPiece.shape[0].length;
    const rows = this.currentPiece.shape.length;

    switch (direction) {
      case 'left':
        if (x > 0 && !this.checkCollision(x - 1, y)) {
          this.currentPiece.position.x = x - 1;
        }
        break;
      case 'right':
        if (x + cols < this.board[0].length && !this.checkCollision(x + 1, y)) {
          this.currentPiece.position.x = x + 1;
        }
        break;
      case 'down':
        if (y + rows < this.board.length && !this.checkCollision(x, y + 1)) {
          this.currentPiece.position.y = y + 1;
        }
        break;
      default:
        break;
    }
  }
  
  checkCollision(x, y) {
    const shape = this.currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col] && this.board[y + row][x + col]) {
          return true;
        }
      }
    }

    return false;
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
