// GameScene.js
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.linesCount = 0;
    this.topScore = 251160;
    this.currentScore = 16512;
    this.level = 0;
  }

  create() {
    const { width, height } = this.cameras.main;
    const boardWidth = 10;
    const boardHeight = 20;
    const blockSize = 15;
    const gameWidth = boardWidth * blockSize;
    const gameHeight = boardHeight * blockSize;
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
    const gameBoardX = linesBoxX;
    const gameBoardY = linesBoxY + linesBoxHeight + gap;
    const gameBoard = this.add.grid(
      gameBoardX,
      gameBoardY,
      gameWidth,
      gameHeight,
      blockSize,
      blockSize,
      0x0000ff,
      0,
      0xffffff,
      1
    ).setOrigin(0);

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
    console.log(scoreLabel);
    const paddedCurrentScore = String(this.currentScore).padStart(7, '0');
    const scoreValue = this.add.text(scoreBoxX + 10, scoreBoxY + topScoreLabel.height + topScoreValue.height + scoreLabel.height + 20, paddedCurrentScore, {
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
    const levelValue = this.add.text(levelBoxX + levelBoxWidth / 2, levelBoxY + 35, levelStr, {
      fontFamily: 'Courier New',
      fontSize: '18px',
      fill: levelTextColor,
    }).setOrigin(0.5);
  }
}
