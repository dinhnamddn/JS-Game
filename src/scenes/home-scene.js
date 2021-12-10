export default class HomeScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'HomeScene'
        });
    }

    preload(){
        this.load.image('background', './assets/trapoutdoor2.png');
        this.load.image('button', './assets/button.png');

        this.load.spritesheet('player', './assets/player.png', {frameWidth: 32, frameHeight: 64});
        
        this.load.audio('background-sound', './assets/backgroundsound.mp3');
    }

    create(){
        this.add.image(0, 0, 'background').setScale(2).setOrigin(0, 0);
        this.bg_sound = this.sound.add('background-sound');
        this.bg_sound.play({volume: 0.03, loop: true});

        this.playButton = this.add.image(300, 120, 'button').setScale(0.5).setOrigin(0, 0);
        this.tutorialButton = this.add.image(505, 120, 'button').setScale(0.5).setOrigin(0, 0);
        
        this.anims.create({
            key: 'anims-player',
            frameRate: 10,
            frames: this.anims.generateFrameNumbers('player', {start: 0}),
            repeat: -1
        })

        this.add.sprite(382, 295, null).setScale(1.5).play('anims-player');
        this.add.sprite(482, 295, null).setScale(1.5).play('anims-player');
        this.add.sprite(582, 295, null).setScale(1.5).play('anims-player');

        this.add.text(355, 145, 'PLAY', {font: 'bold 22px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(535, 145, 'TUTORIAL', {font: 'bold 22px consolas', fill: '#ffffff', align: 'center'});

        this.playButton.setInteractive();
        this.playButton.on('pointerdown', ()=>{
            this.bg_sound.stop();
            this.scene.start('Intro');
        })
        this.tutorialButton.setInteractive();
        this.tutorialButton.on('pointerdown', ()=>{
            this.bg_sound.stop();
            this.scene.start('TutorialScene');
        })
    }
}
