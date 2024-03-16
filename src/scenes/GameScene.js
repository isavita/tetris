// GameScene.js
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const { width, height } = this.cameras.main;
    const boardWidth = 10;
    const boardHeight = 20;
    const blockSize = 30;
    const gameWidth = boardWidth * blockSize;
    const gameHeight = boardHeight * blockSize;
    const offsetX = (width - gameWidth) / 2;
    const offsetY = 100;

    // Add background color
    this.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0);

    // Create the lines box
    const linesBox = this.add.rectangle(offsetX, offsetY, gameWidth, 40, 0xff8c00);
    const linesLabel = this.add.text(offsetX + 10, offsetY + 10, 'LINES-', {
      fontFamily: 'ThugLife',
      fontSize: '24px',
      fill: '#ffffff',
    });
    const linesValue = this.add.text(offsetX + gameWidth - 10, offsetY + 10, '000', {
      fontFamily: 'ThugLife',
      fontSize: '24px',
      fill: '#ffffff',
      align: 'right',
    });

    // Create the game board
    const gameBoard = this.add.grid(
      offsetX,
      offsetY + 50,
      gameWidth,
      gameHeight,
      blockSize,
      blockSize,
      0x0000ff,
      0,
      0xffffff,
      1
    );

    // Create the top score and current score box
    const scoreBoxWidth = 150;
    const scoreBoxHeight = 100;
    const scoreBoxX = offsetX + gameWidth + 20;
    const scoreBoxY = offsetY;
    const scoreBox = this.add.rectangle(scoreBoxX, scoreBoxY, scoreBoxWidth, scoreBoxHeight, 0xff8c00);
    const topScoreLabel = this.add.text(scoreBoxX + 10, scoreBoxY + 10, 'TOP', {
      fontFamily: 'ThugLife',
      fontSize: '18px',
      fill: '#ffffff',
    });
    const topScoreValue = this.add.text(scoreBoxX + scoreBoxWidth - 10, scoreBoxY + 10, '252160', {
      fontFamily: 'ThugLife',
      fontSize: '18px',
      fill: '#ffffff',
      align: 'right',
    });
    const scoreLabel = this.add.text(scoreBoxX + 10, scoreBoxY + 50, 'SCORE', {
      fontFamily: 'ThugLife',
      fontSize: '18px',
      fill: '#ffffff',
    });
    const scoreValue = this.add.text(scoreBoxX + scoreBoxWidth - 10, scoreBoxY + 50, '165120', {
      fontFamily: 'ThugLife',
      fontSize: '18px',
      fill: '#ffffff',
      align: 'right',
    });

    // Create the next box
    const nextBoxWidth = scoreBoxWidth;
    const nextBoxHeight = 120;
    const nextBoxX = scoreBoxX;
    const nextBoxY = scoreBoxY + scoreBoxHeight + 20;
    const nextBox = this.add.rectangle(nextBoxX, nextBoxY, nextBoxWidth, nextBoxHeight, 0xff8c00);
    const nextLabel = this.add.text(nextBoxX + nextBoxWidth / 2, nextBoxY + 20, 'NEXT', {
      fontFamily: 'ThugLife',
      fontSize: '18px',
      fill: '#ffffff',
    }).setOrigin(0.5);
    const nextPreview = this.add.rectangle(
      nextBoxX + nextBoxWidth / 2,
      nextBoxY + nextBoxHeight / 2,
      nextBoxWidth - 20,
      nextBoxHeight - 40,
      0x000000
    ).setOrigin(0.5);

    // Create the level box
    const levelBoxWidth = scoreBoxWidth;
    const levelBoxHeight = 80;
    const levelBoxX = scoreBoxX;
    const levelBoxY = nextBoxY + nextBoxHeight + 20;
    const levelBox = this.add.rectangle(levelBoxX, levelBoxY, levelBoxWidth, levelBoxHeight, 0xff8c00);
    const levelLabel = this.add.text(levelBoxX + levelBoxWidth / 2, levelBoxY + 20, 'LEVEL', {
      fontFamily: 'ThugLife',
      fontSize: '18px',
      fill: '#ffffff',
    }).setOrigin(0.5);
    const levelValue = this.add.text(levelBoxX + levelBoxWidth / 2, levelBoxY + 50, '15', {
      fontFamily: 'ThugLife',
      fontSize: '24px',
      fill: '#ffffff',
    }).setOrigin(0.5);
  }
}
