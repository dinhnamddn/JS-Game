export class TutorialScene extends Phaser.Scene {
    constructor() {
        super({
            key: "TutorialScene"
        })
    }
    preload(){
        // this.load.image('button', './assets/button.png');
        // this.load.image('background2', './assets/trapoutdoor2.png');
    }
    create(){
        this.add.image(0, 0, 'background').setScale(2).setOrigin(0, 0);
        
        this.closeButton = this.add.image(420, 220, 'button').setScale(0.4).setOrigin(0, 0);

        this.add.text(447, 237, 'CLOSE', {font: 'bold 25px consolas', fill: '#ffffff', align: 'center'});

        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.scene.start('HomeScene')
        })
    }
}