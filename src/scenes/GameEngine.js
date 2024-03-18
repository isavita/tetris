// GameEngine.js
export default class GameEngine {
  constructor() {
    this.board = this.createEmptyBoard();
    this.nextPiece = null;
    this.score = 0;
    this.level = 1;
    this.linesCleared = 0;
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
    this.currentPiece = this.createNewPiece();
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
  
    let newX = x;
    let newY = y;
  
    if (clockwise) {
      for (let col = 0; col < rotatedShape[0].length; col++) {
        const newRow = rotatedShape[col];
        for (let row = 0; row < newRow.length; row++) {
          if (newRow[row]) {
            newX = Math.max(0, x - row + 1);
            break;
          }
        }
        break;
      }
    } else {
      for (let row = 0; row < rotatedShape.length; row++) {
        const newRow = rotatedShape[row];
        for (let col = newRow.length - 1; col >= 0; col--) {
          if (newRow[col]) {
            newY = Math.max(0, y - newRow.length + 1 + col);
            break;
          }
        }
        break;
      }
    }
  
    if (!this.checkCollisionRotation(rotatedShape, newX, newY)) {
      this.currentPiece.shape = rotatedShape;
    } else {
      // Reset the position if there's a collision
      this.currentPiece.position = { x, y };
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
            newY < 0 ||
            newY >= this.board.length ||
            (newX < this.board[0].length && this.board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
  
    return false;
  }

  getFramesPerGridCell() {
    const framesPerGridCell = Math.floor(16 / (1 + (this.level * 0.1)));
    return framesPerGridCell;
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
    const position = { x: Math.floor(this.board[0].length / 2) - Math.floor(shape[0].length / 2), y: 0 };
    return { shape, position };
  }

  placePiece() {
    const { shape, position } = this.currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          this.board[position.y + row][position.x + col] = shape[row][col];
        }
      }
    }

    this.currentPiece = this.createNewPiece();
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
