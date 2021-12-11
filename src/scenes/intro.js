export class Intro extends Phaser.Scene {
    constructor() {
        super({
            key: "Intro"
        })
    }
    preload(){
        this.load.image('background2', './assets/background.png');

        this.load.audio("introSound", "./assets/intro.wav");
    }

    create(){
        this.add.image(0, 0, 'background2').setScale(2).setOrigin(0, 0);

        this.sound.add("introSound").play();
        
        this.closeButton = this.add.image(420, 220, 'button').setScale(0.4).setOrigin(0, 0);

        this.add.text(447, 237, 'READY', {font: 'bold 25px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(110, 120, "Một chú hề muốn tham gia vào rạp xiếc JS Club.\n" 
            + "Nhưng rạp xiếc muốn giữ chú hề ở lại và đã tạo ra một thử thách cực kỳ ảo lòi và khó nhằn,\n" 
            + "nếu như chú hề có thể vượt qua thử thách đó thì cậu ta mới được cho phép tham gia rạp xiếc.\n" 
            + "Với kỹ năng đỉnh cao của mình, bạn hãy điều khiển để giúp chú hề chiến thắng thử thách", 
            {
                font: 'bold 15px consolas', 
                fill: '#ffffff',
                align: "center"
            }
        );

        this.closeButton.setInteractive();
        this.closeButton.on('pointerdown', () => {
            this.scene.start('GamePlay')
        })
    }
}