import HomeScene from "./scenes/home-scene.js";
import FirstScene from "./scenes/first-scene.js";
const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 384,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: [HomeScene, FirstScene]
};
var game = new Phaser.Game(config);