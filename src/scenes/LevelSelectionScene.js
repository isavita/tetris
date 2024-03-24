// LevelSelectionScene.js
export default class LevelSelectionScene extends Phaser.Scene {
  constructor() {
    super('LevelSelectionScene');
  }

  preload() {
    // Load the background image
    this.load.image('background', 'assets/images/menuSceneBackground.png');
    
    // Load custom fonts using WebFontLoader
    WebFont.load({
      custom: {
        families: ['yoster'],
        urls: ['assets/fonts/fonts.css']
      },
      active: () => {
        this.create();
      }
    });
  }

  create() {
    // Add the background image
    this.add.image(0, 0, 'background').setOrigin(0);

    // Create the level selection grid
    const levels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const gridWidth = 5;
    const cellWidth = 40;
    const cellHeight = 40;
    const cellSpacing = 10;
    const offsetX = (this.cameras.main.width - (cellWidth * gridWidth + cellSpacing * (gridWidth - 1))) / 2;
    const offsetY = 200;

    this.selectedLevel = 0;

    this.levelCells = [];
    for (let i = 0; i < levels.length; i++) {
      const row = Math.floor(i / gridWidth);
      const col = i % gridWidth;
      const x = offsetX + col * (cellWidth + cellSpacing);
      const y = offsetY + row * (cellHeight + cellSpacing);

      const cell = this.add.rectangle(x, y, cellWidth, cellHeight, 0x006400).setStrokeStyle(2, 0x006400);
      const levelText = this.add.text(x, y, levels[i].toString(), { fontFamily: 'yoster', fontSize: '24px', fill: '#ffffff' }).setOrigin(0.5);

      this.levelCells.push(cell);
    }

    // Create the 'LEVEL' label
    const labelWidth = (cellWidth * gridWidth + cellSpacing * (gridWidth - 1)) * 0.7;
    const labelHeight = 60;
    const labelX = offsetX + (cellWidth * gridWidth + cellSpacing * (gridWidth - 1)) / 2 - labelWidth / 2 - 20;
    const labelY = offsetY - labelHeight - 40;

    const labelBox = this.add.rectangle(labelX, labelY, labelWidth, labelHeight, 0xA52A2A)
      .setStrokeStyle(4, 0x8B0000, 1, 1) // Darker shade on top and left sides
      .setOrigin(0);

    const labelText = this.add.text(labelX + labelWidth / 2, labelY + labelHeight / 2, 'LEVEL', {
      fontFamily: 'yoster',
      fontSize: '32px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Create the "Press SPACE to start" text
    const startTextX = offsetX + (cellWidth * gridWidth + cellSpacing * (gridWidth - 1)) / 2 - 20;
    const startTextY = offsetY + (cellHeight * 2 + cellSpacing) + 40;
    const startText = this.add.text(startTextX, startTextY, 'Press SPACE to start', {
      fontFamily: 'yoster',
      fontSize: '24px',
      fill: '#ffffff'
    }).setOrigin(0.5);

    this.updateSelectedLevel();

    // Add keyboard input listeners
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', this.startGame, this);
  }

  update() {
    // Handle level selection navigation
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left) && this.selectedLevel > 0) {
      this.selectedLevel--;
      this.updateSelectedLevel();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right) && this.selectedLevel < 9) {
      this.selectedLevel++;
      this.updateSelectedLevel();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.selectedLevel >= 5) {
      this.selectedLevel -= 5;
      this.updateSelectedLevel();
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down) && this.selectedLevel <= 4) {
      this.selectedLevel += 5;
      this.updateSelectedLevel();
    }
  }

  updateSelectedLevel() {
    this.levelCells.forEach((cell, index) => {
      if (index === this.selectedLevel) {
        cell.setStrokeStyle(4, 0xffa500);
      } else {
        cell.setStrokeStyle(2, 0x006400);
      }
    });
  }

  startGame() {
    // Start the GameScene with the selected level
    this.scene.start('GameScene', { level: this.selectedLevel });
  }
}
