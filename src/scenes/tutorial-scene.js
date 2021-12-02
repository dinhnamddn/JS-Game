export class TutorialScene extends Phaser.Scene {
    constructor() {
        super({
            key: "TutorialScene"
        })
    }
    preload(){
        this.load.image('button', './assets/button.png');
        this.load.image('background2', './assets/trapoutdoor2.png');
    }
    create(){
        this.add.image(0, 0, 'background2').setScale(2).setOrigin(0, 0);
        
        this.backButton = this.add.image(419, 280, 'button').setScale(0.4).setOrigin(0, 0);

        this.add.text(445, 300, 'CLOSE', {font: 'bold 20px sana-serif', fill: '#ffffff', align: 'center'});

        this.backButton.setInteractive();
        this.backButton.on('pointerdown', ()=>{
            this.scene.start('HomeScene');
        })
    }
}