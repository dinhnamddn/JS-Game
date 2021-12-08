export class TutorialScene extends Phaser.Scene {
    constructor() {
        super({
            key: "TutorialScene"
        })
    }
    preload(){
        this.load.image('background2', './assets/background.png');
    }

    create(){
        this.add.image(0, 0, 'background2').setScale(2).setOrigin(0, 0);
        
        this.closeButton = this.add.image(420, 220, 'button').setScale(0.4).setOrigin(0, 0);

        this.add.text(447, 237, 'CLOSE', {font: 'bold 25px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(260, 100, "- Press left, up, right, down on keyboard to move.\n" + 
            "- There are n+1 traps in a square meter, be careful.\n" +
            "- If you want to die, hit the traps or jump into the sea.\n" +
            "- Black flags are checkpoint, red flag is goal (or not).\n" +
            "- Important: JUST BELIEVE IN YOURSELF.", 
            {
                font: 'bold 15px consolas', 
                fill: '#ffffff'
            }
        );

        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.scene.start('HomeScene')
        })
    }
}