import HomeScene from "./scenes/home-scene.js";
import FirstScene from "./scenes/first-scene.js";
import { GamePlay } from "./scenes/game-play.js";
import { TutorialScene } from "./scenes/tutorial-scene.js";
const config = {
    type: Phaser.AUTO,
    width: 960,//
    height: 384,//
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [HomeScene, FirstScene, GamePlay, TutorialScene]
};
var game = new Phaser.Game(config);