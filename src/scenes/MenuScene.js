export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  preload() {
    this.load.image('menuBackground', 'assets/images/menuSceneBackground.png');
    
    // Load custom fonts using WebFontLoader
    WebFont.load({
      custom: {
        families: ['ThugLifeItalic', 'ThugLife'],
        urls: ['assets/fonts/fonts.css']
      },
      active: () => {
        this.create();
      }
    });
  }

  create() {
    const backgroundImage = this.add.image(0, 0, 'menuBackground').setOrigin(0);
    const scaleX = this.cameras.main.width / backgroundImage.width;
    const scaleY = this.cameras.main.height / backgroundImage.height;
    backgroundImage.setScale(scaleX, scaleY);

    const titleText = this.add.text(
      this.cameras.main.centerX,
      150,
      'TETRIS',
      {
        fontFamily: 'ThugLifeItalic',
        fontSize: '128px',
        fill: '#e35a3e',
        stroke: '#000000',
        strokeThickness: 6,
      }
    );
    titleText.setOrigin(0.5);

    const startButtonCenterX = this.cameras.main.centerX - 100;
    const startButtonCenterY = this.cameras.main.centerY;

    const startButton = this.add.graphics();
    startButton.fillStyle(0xde2b4e, 1);
    startButton.fillRoundedRect(
      startButtonCenterX,
      startButtonCenterY,
      200,
      80,
      40
    );
    startButton.setInteractive(
      new Phaser.Geom.Rectangle(
        startButtonCenterX,
        startButtonCenterY,
        200,
        80
      ),
      Phaser.Geom.Rectangle.Contains
    );

    const startButtonText = this.add.text(
      startButtonCenterX+100,
      startButtonCenterY+40,
      'START',
      {
        fontFamily: 'ThugLife', // Use the custom font
        fontSize: '46px',
        fill: '#ffffff',
        fontStyle: 'italic', // Added italic font style
      }
    );
    startButtonText.setOrigin(0.5);

    // Add hover effect
    startButton.on('pointerover', () => {
      startButton.clear();
      startButton.fillStyle(0xe56b6f, 1);
      startButton.fillRoundedRect(
        startButtonCenterX,
        startButtonCenterY,
        200,
        80,
        40
      );
    });

    // Add click effect
    startButton.on('pointerdown', () => {
      startButton.clear();
      startButton.fillStyle(0xc62828, 1);
      startButton.fillRoundedRect(
        startButtonCenterX,
        startButtonCenterY,
        200,
        80,
        40
      );
      this.scene.start('LevelSelectionScene');
    });

    // Reset button color on pointer out
    startButton.on('pointerout', () => {
      startButton.clear();
      startButton.fillStyle(0xde2b4e, 1);
      startButton.fillRoundedRect(
        startButtonCenterX,
        startButtonCenterY,
        200,
        80,
        40
      );
    });
  }
}
