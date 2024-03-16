import config from './config.js';
import SplashScene from './scenes/SplashScene.js';

const gameConfig = {
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  parent: 'game-container',
  scene: [SplashScene],
};

new Phaser.Game(gameConfig);
