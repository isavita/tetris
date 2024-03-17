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
}
