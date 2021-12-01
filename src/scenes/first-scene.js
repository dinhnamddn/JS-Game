export default class FirstScene extends Phaser.Scene{
    constructor(){
        super({
            key: 'FirstScene'
        });
    }

    preload(){
        this.load.image('background1', 'assets/circus.png');
        this.load.image('platform', 'assets/0.png');
        this.load.spritesheet('player', 'assets/player.png', {frameWidth: 16, frameHeight: 32});

        this.load.image('ground', 'assets/platform.png');
        this.load.image('ground1', 'assets/01.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 
            'assets/player_v2.png',
            { frameWidth: 16, frameHeight: 32 }
        );
    }
    

    create(){
        //background
        this.add.image(0, 0 , 'background1').setScale(2).setOrigin(0, 0);
        
        // //ground
        var platforms = this.physics.add.staticGroup();
        platforms.create(500, 400, 'platform').setScale(6).refreshBody();
        // platforms.create(400, 300, 'ground');
        platforms.create(50, 230, 'ground');
        platforms.create(750, 200, 'ground');
        // platforms.create(300, 100,'ground');
        platforms.create(50, 150,'ground1');
        platforms.create(590, 120,'ground1');
        platforms.create(820, 60,'ground');
        // platforms.create(100, 0,'ground');
        // platforms.create(760, 0,'ground');
        platforms.create(380, 30,'ground1');
        platforms.create(500, 50,'ground1');

        // this.anims.create({
        //     key: 'left',
        //     frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3}),
        //     repeat: -1,
        //     frameRates: 10
        // })

        // this.anims.create({
        //     key: 'turn',
        //     frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11}),
        //     repeat: -1,
        //     frameRates: 5
        // })
        // this.anims.create({
        //     key: 'right',
        //     frames: this.anims.generateFrameNumbers('player', { start: 16, end: 19}),
        //     repeat: -1,
        //     frameRates: 10
        // })
        // //player
        // var player = this.physics.add.sprite(465, 140).setScale(2).setOrigin(0, 0).play('turn');
        // this.physics.add.collider(player, platforms);

        // this.cursors = this.input.keyboard.addKeys({
        //     'up': Phaser.Input.Keyboard.KeyCodes.W,
        //     'down': Phaser.Input.Keyboard.KeyCodes.S,
        //     'left': Phaser.Input.Keyboard.KeyCodes.A,
        //     'right': Phaser.Input.Keyboard.KeyCodes.D,
        // })

        // var cursors = this.input.keyboard.createCursorKeys();
        
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            // frames: [ { key: 'dude', frame: 11 } ],
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11}),
            frameRate: 20,
            repeat: -1
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 12, end: 15 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 16, end: 18 }),
            frameRate: 10,
            repeat: -1
        });

        this.player = this.physics.add.sprite(430, 140, 'dude').setScale(1.5).setOrigin(0, 0).play('turn');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
        
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        // like for or while in java
        this.stars.children.iterate(function (child) {
            child.setBounceY(0.2);

        });

        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#ffffff' });

        this.physics.add.overlap(player, stars, collectStar, null, this); //this line does not work

        this.bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
    
    }

    update(){

        if (cursors.left.isDown)
        {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(160);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-330);
        }
    }

    collectStar (player, star){
        star.disableBody(true, true);
        score += 10;
        scoreText.setText('Score: ' + score);
        if (stars.countActive(true) === 0){
            stars.children.iterate(function (child) {
                child.enableBody(true, child.x, 0, true, true);
            });
            var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            var bomb = bombs.create(x, 16, 'bomb');
            bomb.setBounce(0.99);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        }     
    }
    hitBomb (player, bomb){
        this.physics.pause();

        player.setTint(0xff0000);

        player.anims.play('turn');

        gameOver = true;
    }
}
