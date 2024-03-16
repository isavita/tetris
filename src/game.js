import SplashScene from './scenes/SplashScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  // ... game configuration
  scene: [SplashScene, MenuScene, GameScene]
};

const game = new Phaser.Game(config);
