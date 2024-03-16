import config from './config.js';
import SplashScene from './scenes/SplashScene.js';
import MenuScene from './scenes/MenuScene.js';

const gameConfig = {
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  parent: 'game-container',
  scene: [SplashScene, MenuScene],
};

new Phaser.Game(gameConfig);
