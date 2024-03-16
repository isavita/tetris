// SplashScene.js
export default class SplashScene extends Phaser.Scene {
  constructor() {
    super('SplashScene');
  }

  preload() {
    console.log('SplashScene');
    this.load.image('splashBackground', 'assets/images/splashSceneBackground.png');
  }

  create() {
    const backgroundImage = this.add.image(0, 0, 'splashBackground').setOrigin(0);
    const scaleX = this.cameras.main.width / backgroundImage.width;
    const scaleY = this.cameras.main.height / backgroundImage.height;
    backgroundImage.setScale(scaleX, scaleY);

    this.time.delayedCall(3000, () => {
      this.scene.start('MenuScene');
    });
  }
}
