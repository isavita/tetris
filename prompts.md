**User:**

I am working on building a version of Tetris with Phaser 3. I want the game to include:

1. A splash screen featuring the game's title.
2. A menu scene where the player can click a start button. This scene will display the text "TETRIS" and possibly include a background image.
3. A game scene, which will display a block at the top for "LINES - 000" just above the game board. The game board should have a width of 10 squares and a height of 20 squares. To the left of the board, there should be three stacked boxes. Starting from the bottom, the first box will display "LEVEL" along with the current level number. Above that, a "NEXT" box will show the next piece and its orientation. At the top, there is another box divided into four rows. The first two rows are for "TOP" and will display the top score. Below that, "SCORE" will display the current score, supporting up to six digits.

Let's outline the structure of the project and how to organize the code for the game. After that, we can begin building the game scene by scene using the Phaser 3 JavaScript library.

**Assistant:**

Great! Let's break down the project structure and organize the code for your Tetris game using Phaser 3. Here's a suggested project structure:

```
tetris-game/
│
├── assets/
│   ├── images/
│   │   ├── background.png
│   │   └── ...
│   ├── fonts/
│   │   └── ...
│   └── audio/
│       └── ...
│
├── src/
│   ├── scenes/
│   │   ├── SplashScene.js
│   │   ├── MenuScene.js
│   │   └── GameScene.js
│   ├── config.js
│   └── game.js
│
└── index.html
```

Here's a breakdown of the project structure:

- The `assets` folder contains all the game assets, such as images, fonts, and audio files.
- The `src` folder contains the JavaScript source code for the game.
  - The `scenes` folder contains separate files for each game scene (Splash, Menu, Game).
  - `config.js` holds the game configuration, such as screen dimensions and other settings.
  - `game.js` is the main entry point of the game where you create the Phaser game instance and add the scenes.
- `index.html` is the HTML file that loads the game.

Now, let's start building the game scene by scene:

1. Splash Scene:
   - Create a new file `SplashScene.js` in the `scenes` folder.
   - In this scene, display the game's title and any necessary splash screen graphics.
   - After a certain duration or user interaction, transition to the Menu Scene.

2. Menu Scene:
   - Create a new file `MenuScene.js` in the `scenes` folder.
   - Display the text "TETRIS" and optionally add a background image.
   - Add a start button that, when clicked, transitions to the Game Scene.

3. Game Scene:
   - Create a new file `GameScene.js` in the `scenes` folder.
   - Set up the game board with a width of 10 squares and a height of 20 squares.
   - Display the "LINES - 000" block at the top above the game board.
   - Create three stacked boxes to the left of the board:
     - Bottom box: Display "LEVEL" and the current level number.
     - Middle box: Display "NEXT" and show the next piece and its orientation.
     - Top box: Divide into four rows. The first two rows are for "TOP" and display the top score. The bottom two rows are for "SCORE" and display the current score (up to six digits).

To organize the code for each scene, you can use Phaser's scene lifecycle methods:

- `preload()`: Load assets required for the scene.
- `create()`: Set up the scene, create game objects, and initialize variables.
- `update()`: Update the scene every frame, handle game logic and input.

In the `game.js` file, create the Phaser game instance and add the scenes in the desired order.

```javascript
import SplashScene from './scenes/SplashScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
  // ... game configuration
  scene: [SplashScene, MenuScene, GameScene]
};

const game = new Phaser.Game(config);
```

This outline should give you a good starting point for structuring your Tetris game using Phaser 3. You can now start implementing each scene and adding the necessary game logic and graphics.

Let me know if you have any further questions or if you'd like me to provide more detailed guidance on any specific part of the game!

**User:**

Thank you! This plan is very helpful. I've created the file structure and added empty files, including favicon32x32.png, favicon16x16.png, and the background image for the splash scene, splashSceneBackground.png (1024x1024). I want to continue by completing index.html and integrating the game to ensure this part is working and visible before proceeding with the implementation of the scenes.

**Assistant:**

Excellent! Let's proceed with completing the `index.html` file and integrating the game to ensure it's working and visible before diving into the implementation of the scenes.

Here's an example of how your `index.html` file could look:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tetris Game</title>
  <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="assets/images/favicon16x16.png">
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #000;
    }
    canvas {
      display: block;
      margin: 0 auto;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>

  <script src="https://cdn.jsdelivr.net/npm/phaser@3.55.2/dist/phaser.min.js"></script>
  <script type="module" src="src/game.js"></script>
</body>
</html>
```

In this `index.html` file:

- We set the document title to "Tetris Game".
- We add the favicon links for different sizes (32x32 and 16x16) in the `<head>` section.
- We include a simple CSS style to remove the default margin and padding from the `body`, set the background color to black, and center the game canvas horizontally.
- We create a `<div>` element with the id "game-container" where the game canvas will be inserted.
- We include the Phaser library from a CDN (you can also download and host it locally if preferred).
- Finally, we include the `game.js` file as a module using the `type="module"` attribute.

Now, let's update the `game.js` file to create the Phaser game instance and load the splash scene background:

```javascript
// game.js
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
```

In the `game.js` file:

- We import the `config` object from a separate `config.js` file (which we'll create next) to set the game's width and height.
- We import the `SplashScene` from the `SplashScene.js` file.
- We create a `gameConfig` object with the necessary configuration properties, including the game dimensions, the parent element (the "game-container" div), and the initial scene (SplashScene).
- Finally, we create a new instance of the Phaser game using the `gameConfig`.

Create a new file `config.js` in the `src` folder with the following content:

```javascript
// config.js
export default {
  width: 800,
  height: 600,
  // ... other game configurations
};
```

This `config.js` file exports an object with the game's width and height. You can adjust these values according to your desired game dimensions.

With these files in place, you should now see the game canvas with the splash scene background image when you open the `index.html` file in a web browser.

Next, we'll start implementing the `SplashScene` to display the game title and handle the transition to the `MenuScene`.
