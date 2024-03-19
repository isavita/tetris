// GameScene.js
import GameEngine from "./GameEngine.js";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.gameEngine = new GameEngine();
    this.linesCount = 0;
    this.topScore = 251160;
    this.currentScore = 0;
    this.level = 0;
    this.frames = 0;
    this.blockSize = 15;
    this.cursors = null;
    this.dasDelay = 16; // DAS delay in frames
    this.dasInterval = 6; // DAS interval in frames
    this.dasTimer = 0; // DAS timer
    this.dasDirection = null; // DAS direction ('left' or 'right')
    this.isFastFalling = false;
    this.fastFallInterval = 2; // Interval for fast falling in frames
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
    const paddedLinesCount = String(this.linesCount).padStart(3, '0');
    const linesText = ` LINES - ${paddedLinesCount}`;
    
    const lines = this.add.text(linesBoxX + 10, linesBoxY + 7, linesText, {
        fontFamily: 'Courier New',
        fontSize: linesTextSize,
        fill: linesTextColor,
    }).setOrigin(0);

    // Create the game board
    const borderThickness = 2;
    const gameBoardX = linesBoxX + borderThickness; // adjusted for border thickness
    const gameBoardY = linesBoxY + linesBoxHeight + gap + borderThickness; // adjusted for border thickness
    this.gameBoardX = gameBoardX;
    this.gameBoardY = gameBoardY;
    const gameBoard = this.add.grid(
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
      gameBoardX - borderThickness, // Subtract the borderThickness to position correctly
      gameBoardY - borderThickness, // Subtract the borderThickness to position correctly
      gameWidth + borderThickness * 2, // Add twice the borderThickness to account for both sides
      gameHeight + borderThickness * 2 // Add twice the borderThickness to account for both sides
    );

    // Create the top score and current score box
    const scoreBoxWidth = 100;
    const scoreBoxHeight = 80;
    const scoreBoxX = gameBoardX + gameWidth + gap;
    const scoreBoxY = gameBoardY;
    this.add.rectangle(scoreBoxX, scoreBoxY, scoreBoxWidth, scoreBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const scoreTextColor = '#ffffff';
    const scoreTextSize = '14px';
    const topScoreLabel = this.add.text(scoreBoxX + 10, scoreBoxY + 10, 'TOP', {
      fontFamily: 'Courier New',
      fontSize: scoreTextSize,
      fill: scoreTextColor,
    }).setOrigin(0);
    

    const paddedTopScore = String(this.topScore).padStart(7, '0');
    const topScoreValue = this.add.text(scoreBoxX + 10, scoreBoxY + topScoreLabel.height + 10, paddedTopScore, {
      fontFamily: 'Courier New',
      fontSize: scoreTextSize,
      fill: scoreTextColor,
    }).setOrigin(0);

    const scoreLabel = this.add.text(scoreBoxX + 10, scoreBoxY + topScoreLabel.height + topScoreValue.height + 20, 'SCORE', {
      fontFamily: 'Courier New',
      fontSize: scoreTextSize,
      fill: scoreTextColor,
    }).setOrigin(0);
    const paddedCurrentScore = String(this.currentScore).padStart(7, '0');
    this.scoreValue = this.add.text(scoreBoxX + 10, scoreBoxY + topScoreLabel.height + topScoreValue.height + scoreLabel.height + 20, paddedCurrentScore, {
      fontFamily: 'Courier New',
      fontSize: scoreTextSize,
      fill: scoreTextColor,
    }).setOrigin(0);

    // Create the next box
    const nextBoxWidth = scoreBoxWidth;
    const nextBoxHeight = 80;
    const nextBoxX = scoreBoxX;
    const nextBoxY = scoreBoxY + scoreBoxHeight + gap;
    this.add.rectangle(nextBoxX, nextBoxY, nextBoxWidth, nextBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const nextTextColor = '#ffffff';
    const nextTextSize = '14px';
    const nextLabel = this.add.text(nextBoxX + nextBoxWidth / 2, nextBoxY + 10, 'NEXT', {
      fontFamily: 'Courier New',
      fontSize: nextTextSize,
      fill: nextTextColor,
    }).setOrigin(0.5);
    const nextPreview = this.add.rectangle(
      nextBoxX + nextBoxWidth / 2,
      nextBoxY + nextBoxHeight / 2 + 5,
      nextBoxWidth - 30,
      nextBoxHeight - 30,
      0xfff000,
    ).setOrigin(0.5);

    // Create the level box
    const levelBoxWidth = scoreBoxWidth;
    const levelBoxHeight = 50;
    const levelBoxX = scoreBoxX;
    const levelBoxY = nextBoxY + nextBoxHeight + gap;
    this.add.rectangle(levelBoxX, levelBoxY, levelBoxWidth, levelBoxHeight, 0xffffff, 0.2).setOrigin(0);
    const levelTextColor = '#ffffff';
    const levelTextSize = '14px';
    const levelLabel = this.add.text(levelBoxX + levelBoxWidth / 2, levelBoxY + 10, 'LEVEL', {
      fontFamily: 'Courier New',
      fontSize: levelTextSize,
      fill: levelTextColor,
    }).setOrigin(0.5);
    const levelStr = String(this.level);
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
      if (this.dasDirection !== 'left') {
        this.dasTimer = 0;
        this.dasDirection = 'left';
      }
      this.handleDAS();
    } else if (this.cursors.right.isDown) {
      if (this.dasDirection !== 'right') {
        this.dasTimer = 0;
        this.dasDirection = 'right';
      }
      this.handleDAS();
    } else {
      this.dasDirection = null;
    }

    // Handle fast falling
    if (this.cursors.down.isDown) {
      this.isFastFalling = true;
    } else {
      this.isFastFalling = false;
    }

    if (this.frames >= framesPerGridCell) {
      this.frames = 0;
      if (this.gameEngine.canMovePieceDown()) {
        this.clearPrevPiecePosition();
        this.movePieceDown();
      } else {
        this.gameEngine.placePiece();
        this.gameEngine.clearLines();
        this.drawBoard(); // Redraw the game board after clearing lines
        this.updateScoreDisplay();
        this.updateLevelDisplay();
        if (this.gameEngine.isGameOver()) {
          // Handle game over
          console.log('Game Over');
          this.scene.pause();
          // You can add your game over logic here, such as displaying a game over screen or restarting the game
        }
        this.isFastFalling = false; // Reset fast falling when the piece is placed
      }
    }

    if (this.isFastFalling && this.frames % this.fastFallInterval === 0) {
      if (this.gameEngine.canMovePieceDown()) {
        this.clearPrevPiecePosition();
        this.gameEngine.softDrop();
      }
    }

    this.drawBoard();
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
    // Define colors for each piece type
    const colors = {
      1: 0xff0000, // Red
      2: 0x00ff00, // Green
      3: 0x0000ff, // Blue
      // Add more colors for different piece types
    };
  
    return colors[value] || 0xffffff; // Default to white if color not defined
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

  handleDAS() {
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
