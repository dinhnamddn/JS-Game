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
        this.load.image('bomb','assets/bomb.png')
        this.load.spritesheet('spritesheet.player', './assets/player.png', { frameWidth: 16, frameHeight: 32 });
    }
    create() {
        // background
        this.bg = this.add.image(0, 0, "image.bg").setScale(2);

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
        

        // tilemap
        this.map = this.add.tilemap("tilemap.map-01");
        const tileset = this.map.addTilesetImage("tileset", "image.tileset");
        const platform = this.map.createLayer("platform", tileset).setCollisionByProperty({ collides: true });
        const sea = this.map.createLayer("sea", tileset).setCollisionByProperty({ collides: true });
        
        // player
        this.player = this.physics.add.sprite(20, -20, null);
        this.player.speed = 100;

        this.physics.add.collider(this.player, platform);

        this.physics.add.overlap(this.player, sea, () => console.log("da va cham"));

        this.cameras.main.startFollow(this.player);

        this.cursor = this.input.keyboard.createCursorKeys();
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
        let vector_velocity = {
            x: 0,
            y: 0
        };

        if (this.cursor.left.isDown) vector_velocity.x -= this.player.speed;
        if (this.cursor.right.isDown) vector_velocity.x += this.player.speed;
        if (this.cursor.up.isDown) vector_velocity.y -= this.player.speed;

        if (vector_velocity.x > 0) this.player.play("anims.player-right", true);
        else if (vector_velocity.x < 0) this.player.play("anims.player-left", true);

        if (vector_velocity.x * vector_velocity.x + vector_velocity.y * vector_velocity.y > 0) {
        } else {
            this.player.play("anims.player-idle", true);
        }

        this.player.setVelocityX(vector_velocity.x);
        if (vector_velocity.y != 0)
            this.player.setVelocityY(vector_velocity.y);

        this.bg.setPosition(this.player.x, this.player.y);
        if(250<this.player.x&&this.player.x<320&&this.player.y<-30){
            this.bomb.visible = true;
        }
        if(this.player.x>306){
            this.trap1.visible = true;
            this.trap1.enableBody();
        }
        // console.log(this.player.x+" "+this.player.y)
    }
    hitBomb(player, bomb){
        player.setTint(0xff0000);
        bomb.visible = true
        this.physics.pause();
        alert("Uoa");
        this.scene.start('HomeScene');
    };
}