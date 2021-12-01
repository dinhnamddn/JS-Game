export default class HomeScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'HomeScene'
        });
    }

    preload(){
        this.load.image('background', 'assets/circus.png');
        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 16, frameHeight: 32});
        this.load.audio('background-sound', 'assets/backgroundsound.mp3');
    }

    create(){
        this.add.image(0, 0, 'background').setScale(2).setOrigin(0, 0);
        var background_sound = this.sound.add('background-sound', {volume: 0.2, loop: true}).play();

        this.anims.create({
            key: 'anims-player',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('player', {start: 0}),
            repeat: -1
        })

        this.add.sprite(382, 275, null).setScale(3).play('anims-player');
        this.add.sprite(482, 275, null).setScale(3).play('anims-player');
        this.add.sprite(582, 275, null).setScale(3).play('anims-player');
        this.add.text(420, 150, 'PLAY', {fontSize: '50px', fill: '#ffffff'});
    }

    update(){
        if(this.input.activePointer.leftButtonDown()) {
            this.scene.start('GamePlay');
        }
    }
}
