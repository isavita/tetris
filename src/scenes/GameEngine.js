// GameEngine.js
export default class GameEngine {
  constructor() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
    this.startingLevel = 1;
    this.totalLinesCleared = 0;
    this.softDropScore = 0;
    this.shapes = [
      // I-piece
      [
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      // J-piece
      [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      // L-piece
      [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
      ],
      // O-piece
      [
        [1, 1],
        [1, 1],
      ],
      // S-piece
      [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
      ],
      // T-piece
      [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
      ],
      // Z-piece
      [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ],
    ];
    this.colors = [
      0xff0000, // Red
      0x00ff00, // Green
      0x0000ff, // Blue
      0xffff00, // Yellow
      0xff00ff, // Magenta
      0x00ffff, // Cyan
      0xffa500, // Orange
    ];
    this.nextPiece = this.createNewPiece();
    this.currentPiece = this.createNewPiece();
  }

  init(startingLevel) {
    this.startingLevel = startingLevel;
    this.level = startingLevel;
    this.totalLinesCleared = (startingLevel - 1) * 10;
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
    const rotatedShape = this.getRotatedShape(clockwise);
    const { x, y } = this.currentPiece.position;
  
    // Check if the rotated shape fits within the board boundaries
    const shapeFitsBoard = rotatedShape.every((row, rowIndex) =>
      row.every((cell, colIndex) => {
        const newX = x + colIndex;
        const newY = y + rowIndex;
        return !cell || (newX >= 0 && newX < this.board[0].length && newY < this.board.length);
      })
    );
  
    // Check if the rotated shape collides with any existing pieces on the board
    const collisionDetected = rotatedShape.some((row, rowIndex) =>
      row.some((cell, colIndex) => {
        const newX = x + colIndex;
        const newY = y + rowIndex;
        return cell && newY >= 0 && this.board[newY][newX];
      })
    );
  
    if (shapeFitsBoard && !collisionDetected) {
      this.currentPiece.shape = rotatedShape;
    }
  }

  getRotatedShape(clockwise) {
    const shape = this.currentPiece.shape;
    const rows = shape.length;
    const cols = shape[0].length;
    const rotatedShape = [];

    if (clockwise) {
      for (let col = 0; col < cols; col++) {
        const newRow = [];
        for (let row = rows - 1; row >= 0; row--) {
          newRow.push(shape[row][col]);
        }
        rotatedShape.push(newRow);
      }
    } else {
      for (let col = cols - 1; col >= 0; col--) {
        const newRow = [];
        for (let row = rows - 1; row >= 0; row--) {
          newRow.push(shape[row][col]);
        }
        rotatedShape.unshift(newRow);
      }
    }

    return rotatedShape;
  }
  checkCollisionRotation(rotatedShape, x, y) {
    const rows = rotatedShape.length;
    const cols = rotatedShape[0].length;
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (rotatedShape[row][col]) {
          const newX = x + col;
          const newY = y + row;
  
          if (
            newX < 0 ||
            newX >= this.board[0].length ||
            newY >= this.board.length ||
            (newY >= 0 && newX >= 0 && this.board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
  
    return false;
  }

  getFramesPerGridCell() {
    if (this.level <= 8) {
      return 48 - this.level * 5;
    } else if (this.level <= 17) {
      return 6 - Math.floor((this.level - 8) / 3);
    } else if (this.level <= 28) {
      return 2;
    } else {
      return 1;
    }
  }

  canMovePieceDown() {
    const { shape, position } = this.currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          const newRow = position.y + row + 1;
          if (newRow >= this.board.length || this.board[newRow][position.x + col]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  canMovePieceLeft() {
    const { shape, position } = this.currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          const newCol = position.x + col - 1;
          if (newCol < 0 || this.board[position.y + row][newCol]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  canMovePieceRight() {
    const { shape, position } = this.currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          const newCol = position.x + col + 1;
          if (newCol >= this.board[0].length || this.board[position.y + row][newCol]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  movePieceLeft() {
    this.currentPiece.position.x--;
  }

  movePieceRight() {
    this.currentPiece.position.x++;
  }

  createNewPiece() {
    const randomIndex = Math.floor(Math.random() * this.shapes.length);
    const shape = this.shapes[randomIndex];
    const color = this.colors[randomIndex];
    const position = { x: Math.floor(this.board[0].length / 2) - Math.floor(shape[0].length / 2), y: 0 };
    return { shape, color, position };
  }

  placePiece() {
    const { shape, color, position } = this.currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          this.board[position.y + row][position.x + col] = color;
        }
      }
    }

    this.currentPiece = this.nextPiece;
    this.nextPiece = this.createNewPiece();
  }
  clearLines() {
    let linesCleared = 0;

    for (let row = this.board.length - 1; row >= 0; row--) {
      if (this.board[row].every(cell => cell !== 0)) {
        this.board.splice(row, 1);
        this.board.unshift(Array(this.board[0].length).fill(0));
        linesCleared++;
        row++; // Re-check the current row after shifting the lines down
      }
    }

    if (linesCleared > 0) {
      this.updateScore(linesCleared);
      this.linesCleared += linesCleared;
      this.totalLinesCleared += linesCleared;
      this.updateLevel();
    }
  }

  updateScore(linesCleared) {
    const basePoints = 40;
    const linePoints = [0, 40, 100, 300, 1200];
    const points = basePoints + linePoints[linesCleared] * this.level;
    this.score += points;
    this.score += this.softDropScore;
    this.softDropScore = 0;
  }

  updateLevel() {
    const prevLevel = this.level;
    this.level = Math.floor(this.totalLinesCleared / 10) + 1;
    if (this.level !== prevLevel) {
      console.log(`Level increased to ${this.level}`);
    }
  }

  softDrop() {
    if (this.canMovePieceDown()) {
      this.currentPiece.position.y++;
      this.softDropScore++;
    }
  }

  isGameOver() {
    const { shape, position } = this.currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col] && this.board[position.y + row][position.x + col]) {
          return true;
        }
      }
    }

    return false;
  }
}
