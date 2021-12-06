export class GamePlay extends Phaser.Scene {
    constructor() {
        super({
            key: "GamePlay"
        })
    }
    
    preload() {
        this.load.tilemapTiledJSON("tilemap.map-01", "./assets/map-01.json");
        this.load.image("image.tileset", "./assets/tileset.png");
        this.load.image('image.bg', 'assets/circus.png');
        this.load.image('button', './assets/button.png');
        this.load.image('bomb','assets/bomb.png')
        this.load.spritesheet('spritesheet.player', './assets/player.png', { frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('spritesheet.player.sitDown', './assets/sitdown.png', {frameWidth: 16, frameHeight: 32});
        this.load.audio('deadSound', './assets/movie_1.mp3');
    }
    create() {
        // background
        this.bg = this.add.image(0, 0, "image.bg").setScale(2);

        //sound
        this.deadSound = this.sound.add('deadSound');

        // create animations
        this.anims.create({
            key: 'anims.player-left',
            frames: this.anims.generateFrameNumbers('spritesheet.player', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'anims.player-right',
            frames: this.anims.generateFrameNumbers('spritesheet.player', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'anims.player-idle',
            frames: this.anims.generateFrameNumbers('spritesheet.player', { start: 8, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'anims.player-sitDown',
            frames: [{key: 'spritesheet.player.sitDown', frame: 2}],
            repeat: 0,
            frameRate: 10
        })

        this.anims.create({
            key: 'player.dead',
            frames: [{key: 'spritesheet.player', frame: 8}],
            frameRate: 10,
            repeat: 0
        })


        // tilemap
        this.map = this.add.tilemap("tilemap.map-01");
        const tileset = this.map.addTilesetImage("tileset", "image.tileset");
        const platform = this.map.createLayer("platform", tileset).setCollisionByProperty({ collides: true });
        const sea = this.map.createLayer("sea", tileset).setCollisionByProperty({ collides: true });
        
        // player
        this.player = this.physics.add.sprite(20, -90, null).setScale(2);
        this.player.speed = 100;

        this.physics.add.collider(this.player, platform);

        this.physics.add.overlap(this.player, sea, () => console.log("da va cham"));

        this.cameras.main.startFollow(this.player);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.add.text(-25, -150, '>>>>', {font: 'bold 50px consolas', fill: '#009DAE', align: 'center'}).setRotation(0);
        //trap
        this.trap1 = this.physics.add.sprite(350,-300,'bomb');
        this.trap1.disableBody();
        this.trap1.visible = false;
        this.physics.add.collider(this.trap1, platform);
        this.physics.add.collider(this.player, this.trap1, this.hitBomb, null, this);
        this.bomb = this.physics.add.staticGroup().create(300,-50,'bomb');
        this.bomb.visible = false
        this.physics.add.collider(this.player, this.bomb, this.hitBomb, null, this); 
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.play("anims.player-left", true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);
                this.player.play("anims.player-right", true);
                } else if (this.cursors.down.isDown && this.player.body.onFloor()) {
                    this.player.play("anims.player-sitDown", true);
                    } else {
                        this.player.setVelocityX(0);
                        this.player.play("anims.player-idle", true);
                    }

        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.player.setVelocityY(-280);
        } 
        
        this.bg.setPosition(this.player.x, this.player.y);
        if(250<this.player.x&&this.player.x<320&&this.player.y<-30){
            this.bomb.visible = true;
        }
        if(this.player.x>306){
            this.trap1.visible = true;
            this.trap1.enableBody();
        }
    }
    hitBomb(player, bomb){
        player.setTint(0xff0000);
        bomb.visible = true
        this.physics.pause();
        this.gameOver();
    };

    gameOver(){
        this.physics.pause();
        this.player.play('player.dead', true).setTint(0xff0000);
        this.deadSound.play();

        this.playAgain = this.add.image(this.player.x - 170, this.player.y - 15, 'button').setScale(0.5).setOrigin(0, 0);
        this.goToMenu = this.add.image(this.player.x + 45, this.player.y - 15, 'button').setScale(0.5).setOrigin(0, 0);
        
        this.add.text(this.player.x - 150, this.player.y + 10, 'PLAY AGAIN', {font: 'bold 20px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(this.player.x + 100, this.player.y + 10, 'HOME', {font: 'bold 20px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(this.player.x - 145, this.player.y - 120, ' NGU!!! ', 
            { 
                font: 'bold 70px consolas',
                backgroundColor: '#F90716', 
                fill: '#ffffff', 
                padding: 5,
                align: 'center'
            }
        );
        
        this.clickButton(this.playAgain, 'GamePlay');
        this.clickButton(this.goToMenu, 'HomeScene');
    }

    clickButton(button, scene){
        button.setInteractive();
        button.on('pointerdown', ()=>{
            // this.bg_sound.stop();
            this.scene.start(scene);
        })
    }
}