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
        this.load.image('bomb','assets/bomb.png');
        this.load.image('cycle','assets/cycle.png');

        this.load.spritesheet('spritesheet.player', './assets/player.png', {frameWidth: 16, frameHeight: 32});
        this.load.spritesheet('spritesheet.player.sitDown', './assets/sitdown.png', {frameWidth: 16, frameHeight: 32});

        this.load.audio('deadSound', './assets/movie_1.mp3');
        this.load.audio('jumpSound', './assets/jump.wav');
        this.load.audio('waterSound', './assets/water.wav');
    }

    create() {
        // background
        this.background = this.add.image(0, 0, "image.bg").setScale(2);

        //sound
        this.deadSound = this.sound.add('deadSound');
        this.jumpSound = this.sound.add('jumpSound');
        this.waterSound = this.sound.add('waterSound');

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
        const trap = this.map.createLayer("trapon", tileset).setCollisionByProperty({ collides: true });
        const fake = this.map.createLayer("fake", tileset).setCollisionByProperty({ collides: true });
        const final = this.map.createLayer("final", tileset).setCollisionByProperty({ collides: true });
        const blackFlag = this.map.createLayer("blackflag", tileset).setCollisionByProperty({ collides: true });
        const redFlag = this.map.createLayer("redflag", tileset).setCollisionByProperty({ collides: true });
        
        // player
        this.player = this.physics.add.sprite(20, -90, 'spritesheet.player').setScale(2).refreshBody();

        this.physics.add.collider(this.player, platform);
        this.physics.add.collider(this.player, final);
        this.physics.add.collider(this.player, blackFlag, this.hitCheckPoint, null, this);
        this.physics.add.collider(this.player, redFlag, this.hitRedFlag, null, this);
        
        this.cameras.main.startFollow(this.player);
        
        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.add.text(0, -150, '>>>>', {font: 'bold 50px consolas', fill: '#009DAE', align: 'center'}).setRotation(0);
        
        //trap
        this.physics.add.collider(this.player, sea, this.hitSea, null, this);
        this.physics.add.collider(this.player, trap, this.hitTrap, null, this);

        this.trap1 = this.physics.add.sprite(350, -300, 'bomb');
        this.trap1.disableBody();
        this.trap1.visible = false;
        this.physics.add.collider(this.trap1, platform);
        this.physics.add.collider(this.player, this.trap1, this.hitTrap, null, this);

        this.bomb = this.physics.add.staticGroup().create(300, -50, 'bomb');
        this.bomb.visible = false
        this.physics.add.collider(this.player, this.bomb, this.hitTrap, null, this); 
    }

    update() {
        if(this.player.y > 400) {
            this.gameOver();
        }

        //player's movement
        let player_velocity = 145;

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-1 * player_velocity);
            this.player.play("anims.player-left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(player_velocity);
            this.player.play("anims.player-right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.play("anims.player-idle", true);
        }

        if (this.cursors.up.isDown && this.player.body.onFloor())
        {
            this.jumpSound.play();
            this.player.setVelocityY(-2 * player_velocity);
        }  else if (this.cursors.down.isDown && this.player.body.onFloor()) {
            this.player.play("anims.player-sitDown", true);
        }
        
        //background's movement
        this.background.setPosition(this.player.x, this.player.y);

        //trap
        if(250 < this.player.x && this.player.x < 320 && this.player.y < -30){
            this.bomb.visible = true;
        }

        if(this.player.x > 306){
            this.trap1.visible = true;
            this.trap1.enableBody();
        }
    }

    hitTrap(player, trap){
        trap.visible = true;
        this.deadSound.play();
        this.gameOver();
    };

    hitSea(){
        this.waterSound.play();
        this.gameOver();
    }

    gameOver(){
        this.physics.pause();
        this.player.play('player.dead', true).setTint(0xff0000);

        this.playAgain = this.add.image(this.player.x - 190, this.player.y + 15, 'button').setScale(0.5).setOrigin(0, 0);
        this.goToMenu = this.add.image(this.player.x + 32, this.player.y + 15, 'button').setScale(0.5).setOrigin(0, 0);
                
        this.add.text(this.player.x - 170, this.player.y + 40, 'PLAY AGAIN', {font: 'bold 20px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(this.player.x + 87, this.player.y + 40, 'HOME', {font: 'bold 20px consolas', fill: '#ffffff', align: 'center'});
        this.add.text(this.player.x - 120, this.player.y - 120, 'STUPID', 
        { 
            font: 'bold 70px consolas',
            backgroundColor: '#F90716', 
            fill: '#ffffff', 
            padding: 5,
            align: 'center'
        });
            
        this.clickButton(this.playAgain, 'GamePlay');
        this.clickButton(this.goToMenu, 'HomeScene');
    }

    clickButton(button, scene){
        button.setInteractive();
        button.on('pointerdown', ()=>{
            this.scene.start(scene);
        })
    }

    hitRedFlag(){
        this.physics.pause();

        this.close = this.add.image(this.player.x - 46, this.player.y + 30, "button").setScale(0.3).setOrigin(0, 0);
        
        this.text0 = this.add.text(this.player.x - 28, this.player.y + 40, "CLOSE", {font: "20px consolas", fill: "#ffffff"});
        this.text1 = this.add.text(this.player.x - 131, this.player.y - 120, "This is a fake goal.\n" + "Come back to the start place\n" + "and go to the left side to find\n" + "the way go to the goal.", 
        {
            font: "15px consolas",
            fill: "#ffffff",
            backgroundColor: "blue",
            padding: 5,
            align: "center"
        });

        this.close.setInteractive();
        this.close.on("pointerdown", () => {
            this.close.visible = false;
            this.text0.visible = false;
            this.text1.visible = false;
            this.physics.resume()
        })
    }

    hitCheckPoint(){

    }
}