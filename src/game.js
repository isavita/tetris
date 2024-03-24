import config from './config.js';
import SplashScene from './scenes/SplashScene.js';
import MenuScene from './scenes/MenuScene.js';
import LevelSelectionScene from './scenes/LevelSelectionScene.js';
import GameScene from './scenes/GameScene.js';

const gameConfig = {
  type: Phaser.AUTO,
  width: config.width,
  height: config.height,
  parent: 'game-container',
  scene: [SplashScene, MenuScene, LevelSelectionScene, GameScene],
};

new Phaser.Game(gameConfig);
