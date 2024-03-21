// GameScene.js
import GameEngine from "./GameEngine.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.gameEngine = new GameEngine();
    this.frames = 0;
    this.blockSize = 15;
    this.cursors = null;
    this.dasDelay = 16;
    this.dasInterval = 6;
    this.dasTimer = 0;
    this.dasDirection = null;
    this.isFastFalling = false;
    this.fastFallInterval = 2;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', this.rotatePieceClockwise, this);
    this.input.keyboard.on('keydown-SHIFT', this.rotatePieceCounterclockwise, this);
    const { width, height } = this.cameras.main;
    const boardWidth = 10;
    const boardHeight = 20;
    const gameWidth = boardWidth * this.blockSize;
    const gameHeight = boardHeight * this.blockSize;
    const offsetX = (width - gameWidth) / 2;
    const offsetY = 20;
    const gap = 20;

    // Add background color
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

    // Create the lines box
    const linesBoxWidth = 160;
    const linesBoxHeight = 30;
    const linesBoxX = offsetX;
    const linesBoxY = offsetY;
    this.add.rectangle(linesBoxX, linesBoxY, linesBoxWidth, linesBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const linesTextColor = '#ffffff';
    const linesTextSize = '18px';
    const paddedLinesCount = String(this.gameEngine.linesCleared).padStart(3, '0');
    const linesText = ` LINES - ${paddedLinesCount}`;
    this.linesCountText = this.add.text(linesBoxX + 10, linesBoxY + 7, linesText, {
      fontFamily: 'Courier New',
      fontSize: linesTextSize,
      fill: linesTextColor,
    }).setOrigin(0);

    // Create the game board
    const borderThickness = 2;
    const gameBoardX = linesBoxX + borderThickness;
    const gameBoardY = linesBoxY + linesBoxHeight + gap + borderThickness;
    this.gameBoardX = gameBoardX;
    this.gameBoardY = gameBoardY;
    this.add.grid(
      gameBoardX,
      gameBoardY,
      gameWidth,
      gameHeight,
      this.blockSize,
      this.blockSize,
      0x0000ff,
      0,
      0xffffff,
      1
    ).setOrigin(0);

    // Draw a border around the game board
    const border = this.add.graphics();
    border.lineStyle(borderThickness, 0xffffff, 1);
    border.strokeRect(
      gameBoardX - borderThickness,
      gameBoardY - borderThickness,
      gameWidth + borderThickness * 2,
      gameHeight + borderThickness * 2
    );

    // Create the score box
    const scoreBoxWidth = 100;
    const scoreBoxHeight = 80;
    const scoreBoxX = gameBoardX + gameWidth + gap;
    const scoreBoxY = gameBoardY;
    this.add.rectangle(scoreBoxX, scoreBoxY, scoreBoxWidth, scoreBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const scoreTextColor = '#ffffff';
    const scoreTextSize = '14px';
    this.add.text(scoreBoxX + 10, scoreBoxY + 10, 'SCORE', {
      fontFamily: 'Courier New',
      fontSize: scoreTextSize,
      fill: scoreTextColor,
    }).setOrigin(0);
    const paddedCurrentScore = String(this.gameEngine.score).padStart(7, '0');
    this.scoreValue = this.add.text(scoreBoxX + 10, scoreBoxY + 40, paddedCurrentScore, {
      fontFamily: 'Courier New',
      fontSize: scoreTextSize,
      fill: scoreTextColor,
    }).setOrigin(0);

    // Create the next box
    this.nextBoxWidth = scoreBoxWidth;
    this.nextBoxHeight = 80;
    this.nextBoxX = scoreBoxX;
    this.nextBoxY = scoreBoxY + scoreBoxHeight + gap;
    this.add.rectangle(this.nextBoxX, this.nextBoxY, this.nextBoxWidth, this.nextBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const nextTextColor = '#ffffff';
    const nextTextSize = '14px';
    this.add.text(this.nextBoxX + this.nextBoxWidth / 2, this.nextBoxY + 10, 'NEXT', {
      fontFamily: 'Courier New',
      fontSize: nextTextSize,
      fill: nextTextColor,
    }).setOrigin(0.5);
    this.nextPreviewGraphics = this.add.graphics();
    this.drawNextPiecePreview();

    // Create the level box
    const levelBoxWidth = scoreBoxWidth;
    const levelBoxHeight = 50;
    const levelBoxX = this.nextBoxX;
    const levelBoxY = this.nextBoxY + this.nextBoxHeight + gap;
    this.add.rectangle(levelBoxX, levelBoxY, levelBoxWidth, levelBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const levelTextColor = '#ffffff';
    const levelTextSize = '14px';
    this.add.text(levelBoxX + levelBoxWidth / 2, levelBoxY + 10, 'LEVEL', {
      fontFamily: 'Courier New',
      fontSize: levelTextSize,
      fill: levelTextColor,
    }).setOrigin(0.5);
    const levelStr = String(this.gameEngine.level);
    this.levelValue = this.add.text(levelBoxX + levelBoxWidth / 2, levelBoxY + 35, levelStr, {
      fontFamily: 'Courier New',
      fontSize: '18px',
      fill: levelTextColor,
    }).setOrigin(0.5);

    // Draw the game board
    this.drawBoard();
    this.drawCurrentPiece();
  }

  update() {
    this.frames++;
    const framesPerGridCell = this.gameEngine.getFramesPerGridCell();

    // Handle left and right movement
    if (this.cursors.left.isDown) {
      this.handleDAS('left');
    } else if (this.cursors.right.isDown) {
      this.handleDAS('right');
    } else {
      this.dasDirection = null;
    }

    // Handle fast falling
    this.isFastFalling = this.cursors.down.isDown;

    if (this.frames >= framesPerGridCell) {
      this.frames = 0;
      if (this.gameEngine.canMovePieceDown()) {
        this.clearPrevPiecePosition();
        this.movePieceDown();
      } else {
        this.gameEngine.placePiece();
        this.gameEngine.clearLines();
        this.drawBoard();
        this.updateScoreDisplay();
        this.updateLevelDisplay();
        this.updateLinesCountDisplay();
        this.drawNextPiecePreview();
        if (this.gameEngine.isGameOver()) {
          console.log('Game Over');
          this.scene.pause();
        }
        this.isFastFalling = false;
      }
    }

    if (this.isFastFalling && this.frames % this.fastFallInterval === 0) {
      if (this.gameEngine.canMovePieceDown()) {
        this.clearPrevPiecePosition();
        this.gameEngine.softDrop();
      }
    }

    this.drawCurrentPiece();
  }

  updateScoreDisplay() {
    const paddedCurrentScore = String(this.gameEngine.score).padStart(7, '0');
    this.scoreValue.setText(paddedCurrentScore);
  }

  updateLevelDisplay() {
    const levelStr = String(this.gameEngine.level);
    this.levelValue.setText(levelStr);
  }

  updateLinesCountDisplay() {
    const paddedLinesCount = String(this.gameEngine.linesCleared).padStart(3, '0');
    const linesText = ` LINES - ${paddedLinesCount}`;
    this.linesCountText.setText(linesText);
  }

  drawBoard() {
    const { board } = this.gameEngine;
    const rows = board.length;
    const cols = board[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = board[row][col];
        const blockX = this.gameBoardX + col * this.blockSize;
        const blockY = this.gameBoardY + row * this.blockSize;

        if (cell !== 0) {
          const color = this.getColorForPiece(cell);
          this.add.rectangle(blockX, blockY, this.blockSize, this.blockSize, color).setOrigin(0);
        } else {
          this.add.rectangle(blockX, blockY, this.blockSize, this.blockSize, 0x000000).setOrigin(0);
        }
      }
    }
  }

  getColorForPiece(value) {
    const colors = {
      1: 0xff0000,
      2: 0x00ff00,
      3: 0x0000ff,
    };

    return colors[value] || 0xffffff;
  }

  drawCurrentPiece() {
    const { currentPiece } = this.gameEngine;
    const { shape, position } = currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;
    const gameBoardX = this.gameBoardX;
    const gameBoardY = this.gameBoardY;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          const blockX = gameBoardX + (position.x + col) * this.blockSize;
          const blockY = gameBoardY + (position.y + row) * this.blockSize;
          this.add.rectangle(blockX, blockY, this.blockSize, this.blockSize, 0xff0000).setOrigin(0);
        }
      }
    }
  }

  drawNextPiecePreview() {
    const { nextPiece } = this.gameEngine;
    const { shape } = nextPiece;
    const rows = shape.length;
    const cols = shape[0].length;
  
    const nextBoxX = this.gameBoardX + 10 * this.blockSize + 20;
    const nextBoxY = this.gameBoardY + this.nextBoxHeight + 35;
  
    const blockSize = Math.min((this.nextBoxWidth - 20) / cols, (this.nextBoxHeight - 20) / rows);
    const offsetX = (this.nextBoxWidth - cols * blockSize) / 2;
    const offsetY = (this.nextBoxHeight - rows * blockSize) / 2;
  
    this.nextPreviewGraphics.clear();
  
    const smallerBlockSize = blockSize * 0.75;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          const blockX = nextBoxX + offsetX + col * smallerBlockSize +10;
          const blockY = nextBoxY + offsetY + row * smallerBlockSize;
          this.nextPreviewGraphics.fillStyle(0xff0000);
          this.nextPreviewGraphics.fillRect(blockX, blockY, smallerBlockSize, smallerBlockSize);
        }
      }
    }
  }

  movePieceDown() {
    const { currentPiece } = this.gameEngine;
    currentPiece.position.y++;
  }

  clearPrevPiecePosition() {
    const { currentPiece } = this.gameEngine;
    const { shape, position } = currentPiece;
    const rows = shape.length;
    const cols = shape[0].length;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (shape[row][col]) {
          const blockX = this.gameBoardX + (position.x + col) * this.blockSize;
          const blockY = this.gameBoardY + (position.y + row) * this.blockSize;
          this.add.rectangle(blockX, blockY, this.blockSize, this.blockSize, 0x000000).setOrigin(0);
        }
      }
    }
  }

  handleDAS(direction) {
    if (this.dasDirection !== direction) {
      this.dasTimer = 0;
      this.dasDirection = direction;
    }

    if (this.dasTimer === 0) {
      this.movePieceHorizontally();
    }

    this.dasTimer++;

    if (this.dasTimer >= this.dasDelay) {
      if ((this.dasTimer - this.dasDelay) % this.dasInterval === 0) {
        this.movePieceHorizontally();
      }
    }
  }

  movePieceHorizontally() {
    if (this.dasDirection === 'left' && this.gameEngine.canMovePieceLeft()) {
      this.clearPrevPiecePosition();
      this.gameEngine.movePieceLeft();
    } else if (this.dasDirection === 'right' && this.gameEngine.canMovePieceRight()) {
      this.clearPrevPiecePosition();
      this.gameEngine.movePieceRight();
    }
  }

  rotatePieceClockwise() {
    const rotatedShape = this.gameEngine.getRotatedShape(true);
    const { x, y } = this.gameEngine.currentPiece.position;

    if (!this.gameEngine.checkCollisionRotation(rotatedShape, x, y)) {
      this.clearPrevPiecePosition();
      this.gameEngine.rotatePiece(true);
    }
  }

  rotatePieceCounterclockwise() {
    const rotatedShape = this.gameEngine.getRotatedShape(false);
    const { x, y } = this.gameEngine.currentPiece.position;

    if (!this.gameEngine.checkCollisionRotation(rotatedShape, x, y)) {
      this.clearPrevPiecePosition();
      this.gameEngine.rotatePiece(false);
    }
  }
}
