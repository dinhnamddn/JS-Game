export class GamePlay extends Phaser.Scene {
  constructor() {
    super({
      key: "GamePlay",
    });
  }

  preload() {
    this.load.tilemapTiledJSON("tilemap.map-01", "./assets/map-01.json");

    this.load.image("image.tileset", "./assets/tileset.png");
    this.load.image("image.bg", "assets/circus.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.image("cycle", "assets/cycle.png");
    this.load.image("trap.down", "assets/trap_down.png");
    this.load.image("trap.up", "assets/trap_up.png");
    this.load.image("trap.left", "assets/trap_left.png");
    this.load.image("trap.fire", "assets/trap_fire.png");
    this.load.spritesheet("spritesheet.player", "./assets/player.png", {
      frameWidth: 16,
      frameHeight: 32,
    });
    this.load.spritesheet(
      "spritesheet.player.sitDown",
      "./assets/sitdown.png",
      { frameWidth: 16, frameHeight: 32 }
    );

    this.load.audio("deadSound", "./assets/movie_1.mp3");
    this.load.audio("jumpSound", "./assets/jump.wav");
    this.load.audio("waterSound", "./assets/water.wav");
    this.load.audio("winSound", "./assets/done.wav");
  }

  create() {
    let player_location_x = 0;
    let player_location_y = 0;

    let player_alive = false;

    // background
    this.background = this.add.image(0, 0, "image.bg").setScale(2);

    //sound
    this.deadSound = this.sound.add("deadSound");
    this.jumpSound = this.sound.add("jumpSound");
    this.waterSound = this.sound.add("waterSound");
    this.winSound = this.sound.add("winSound");

    // create animations
    this.anims.create({
      key: "anims.player-left",
      frames: this.anims.generateFrameNumbers("spritesheet.player", {
        start: 4,
        end: 7,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "anims.player-right",
      frames: this.anims.generateFrameNumbers("spritesheet.player", {
        start: 12,
        end: 15,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "anims.player-idle",
      frames: this.anims.generateFrameNumbers("spritesheet.player", {
        start: 8,
        end: 11,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "anims.player-sitDown",
      frames: [{ key: "spritesheet.player.sitDown", frame: 2 }],
      repeat: 0,
      frameRate: 10,
    });

    this.anims.create({
      key: "player.dead",
      frames: [{ key: "spritesheet.player", frame: 8 }],
      frameRate: 10,
      repeat: 0,
    });

    // tilemap
    this.map = this.add.tilemap("tilemap.map-01");
    const tileset = this.map.addTilesetImage("tileset", "image.tileset");
    const platform = this.map
      .createLayer("platform", tileset)
      .setCollisionByProperty({ collides: true });
    const sea = this.map
      .createLayer("sea", tileset)
      .setCollisionByProperty({ collides: true });
    const trap = this.map
      .createLayer("trapon", tileset)
      .setCollisionByProperty({ collides: true });
    const fake = this.map
      .createLayer("fake", tileset)
      .setCollisionByProperty({ collides: true });
    const final = this.map
      .createLayer("final", tileset)
      .setCollisionByProperty({ collides: true });
    const blackFlag = this.map
      .createLayer("blackflag", tileset)
      .setCollisionByProperty({ collides: true });
    const redFlag = this.map
      .createLayer("redflag", tileset)
      .setCollisionByProperty({ collides: true });

    // player
    this.player = this.physics.add
      .sprite(20, -90, "spritesheet.player")
      .setScale(2)
      .refreshBody();

    this.physics.add.collider(this.player, platform);
    this.physics.add.collider(this.player, final, this.hitGoal, null, this);
    this.physics.add.collider(
      this.player,
      blackFlag,
      this.hitCheckPoint,
      null,
      this
    );
    this.physics.add.collider(
      this.player,
      redFlag,
      this.hitRedFlag,
      null,
      this
    );

    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.add
      .text(0, -150, ">>>>", {
        font: "bold 50px consolas",
        fill: "#009DAE",
        align: "center",
      })
      .setRotation(0);

    //trap
    this.physics.add.collider(this.player, sea, this.hitSea, null, this);
    this.physics.add.collider(this.player, trap, this.hitTrap, null, this);

    this.trap1 = this.physics.add.sprite(350, -300, "bomb");
    this.trap1.disableBody();
    this.trap1.visible = false;
    this.physics.add.collider(this.trap1, platform);
    this.physics.add.collider(
      this.player,
      this.trap1,
      this.hitTrap,
      null,
      this
    );

    this.bomb = this.physics.add.staticGroup().create(300, -50, "bomb");
    this.bomb.visible = false;
    this.physics.add.collider(this.player, this.bomb, this.hitTrap, null, this);
    this.createTrap(platform);
  }

  update() {
    if (this.player.y > 400) {
      this.gameOver();
    }

    //player's movement
    let player_velocity = 140;

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

    if (this.cursors.up.isDown && this.player.body.onFloor()) {
      this.jumpSound.play();
      this.player.setVelocityY(-2 * player_velocity);
    } else if (this.cursors.down.isDown && this.player.body.onFloor()) {
      this.player.play("anims.player-sitDown", true);
    }

    //background's movement
    this.background.setPosition(this.player.x, this.player.y);

    //trap
    if (250 < this.player.x && this.player.x < 320 && this.player.y < -30) {
      this.bomb.visible = true;
    }
    this.checkNearTrap();
    console.log(this.player.x + "  " + this.player.y);
  }

  hitTrap() {
    this.deadSound.play();
    if (this.player_alive == true) {
      this.player.setPosition(this.player_location_x, this.player_location_y);
    } else {
      this.player.play("player.dead", true).setTint(0xff0000);
      this.gameOver(" OOPS ");
    }
  }

  hitSea() {
    this.waterSound.play();
    if (this.player_alive == true) {
      this.player.setPosition(this.player_location_x, this.player_location_y);
    } else {
      this.player.play("player.dead", true).setTint(0xff0000);
      this.gameOver(" OOPS ");
    }
  }

  gameOver(text) {
    this.physics.pause();

    this.playAgain = this.add
      .image(this.player.x - 190, this.player.y + 15, "button")
      .setScale(0.5)
      .setOrigin(0, 0);
    this.goToMenu = this.add
      .image(this.player.x + 32, this.player.y + 15, "button")
      .setScale(0.5)
      .setOrigin(0, 0);

    this.add.text(this.player.x - 170, this.player.y + 40, "PLAY AGAIN", {
      font: "bold 20px consolas",
      fill: "#ffffff",
      align: "center",
    });
    this.add.text(this.player.x + 87, this.player.y + 40, "HOME", {
      font: "bold 20px consolas",
      fill: "#ffffff",
      align: "center",
    });
    this.add.text(this.player.x - 100, this.player.y - 120, text, {
      font: "bold 70px consolas",
      backgroundColor: "#F90716",
      fill: "#ffffff",
      padding: 5,
      align: "center",
    });

    this.clickButton(this.playAgain, "GamePlay");
    this.clickButton(this.goToMenu, "HomeScene");
  }

  clickButton(button, scene) {
    button.setInteractive();
    button.on("pointerdown", () => {
      this.scene.start(scene);
    });
  }

  hitRedFlag() {
    this.physics.pause();

    this.close = this.add
      .image(this.player.x - 46, this.player.y + 30, "button")
      .setScale(0.3)
      .setOrigin(0, 0);

    this.text0 = this.add.text(
      this.player.x - 28,
      this.player.y + 40,
      "CLOSE",
      { font: "20px consolas", fill: "#ffffff" }
    );
    this.text1 = this.add.text(
      this.player.x - 131,
      this.player.y - 120,
      "This is a fake goal.\n" +
        "Come back to the start place\n" +
        "and go to the left side to find\n" +
        "the way go to the goal.",
      {
        font: "15px consolas",
        fill: "#ffffff",
        backgroundColor: "blue",
        padding: 5,
        align: "center",
      }
    );

    this.close.setInteractive();
    this.close.on("pointerdown", () => {
      this.close.visible = false;
      this.text0.visible = false;
      this.text1.visible = false;
      this.physics.resume();
    });
  }

  hitCheckPoint() {
    this.player_location_x = this.player.x;
    this.player_location_y = this.player.y;
    this.player_alive = true;
  }

  hitGoal() {
    this.physics.pause();
    this.winSound.play();
    this.gameOver(" WIN ");
  }
  createTrap(platform) {
    this.trap2 = this.physics.add.sprite(800, -288, "bomb");
    this.trap2.disableBody();
    this.trap2.visible = false;
    this.physics.add.collider(this.trap2, platform);
    this.physics.add.collider(
      this.player,
      this.trap2,
      this.hitTrap,
      null,
      this
    );
    this.trap3 = this.physics.add.sprite(1032, -250, "bomb");
    this.trap3.disableBody();
    this.trap3.visible = false;
    this.physics.add.collider(this.trap3, platform);
    this.physics.add.collider(
      this.player,
      this.trap3,
      this.hitTrap,
      null,
      this
    );
    this.trap4 = this.physics.add.sprite(1330, -350, "bomb");
    this.trap4.disableBody();
    this.trap4.visible = false;
    this.physics.add.collider(this.trap4, platform);
    this.physics.add.collider(
      this.player,
      this.trap4,
      this.hitTrap,
      null,
      this
    );
    this.physics.add.collider(this.trap4, platform);
    this.trap5 = this.physics.add.staticGroup();
    for (var i = 0; i < 4; i++) {
      this.trap5.create(3500 + (i * 33) / 2.5, -275, "trap.down");
    }
    this.trap5.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap5,
      this.hitTrap,
      null,
      this
    );
    this.trap6 = this.physics.add.staticGroup();
    for (var i = 0; i < 4; i++) {
      this.trap6.create(1190 + (i * 33) / 2.5, -5, "trap.up");
    }
    this.trap6.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap6,
      this.hitTrap,
      null,
      this
    );
    this.trap7 = this.physics.add.staticGroup();
    for (var i = 0; i < 1; i++) {
      this.trap7.create(3755 + (i * 33) / 2.5, -105, "trap.fire");
    }
    this.trap7.children.iterate((child) => {
      child.setScale(1, 1);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap7,
      this.hitTrap,
      null,
      this
    );
    this.trap7.visible = false;
    this.trap8 = this.physics.add.staticGroup();
    for (var i = 0; i < 4; i++) {
      this.trap8.create(4010 + (i * 33) / 2.5, -5, "trap.fire");
    }
    this.trap8.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap8,
      this.hitTrap,
      null,
      this
    );
    this.trap8.visible = false;
    this.trap9 = this.physics.add.staticGroup();
    for (var i = 0; i < 3; i++) {
      this.trap9.create(-1930 + (i * 33) / 2.5, 215, "trap.up");
    }
    this.trap9.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap9,
      this.hitTrap,
      null,
      this
    );
    this.trap9.visible = false;
    this.trap10 = this.physics.add.staticGroup();
    for (var i = 0; i < 3; i++) {
      this.trap10.create(-2093 + (i * 33) / 2.5, 280, "trap.up");
    }
    this.trap10.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap10,
      this.hitTrap,
      null,
      this
    );
    this.trap10.visible = false;
    this.trap11 = this.physics.add.staticGroup();
    for (var i = 0; i < 4; i++) {
      this.trap11.create(-6360 + (i * 33) / 2.5, -780, "trap.up");
    }
    this.trap11.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap11,
      this.hitTrap,
      null,
      this
    );
    this.trap11.visible = false;
    this.trap12 = this.physics.add.staticGroup();
    for (var i = 0; i < 1; i++) {
      this.trap12.create(-4310 + (i * 33) / 2.5, -905, "trap.up");
    }
    this.trap12.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap12,
      this.hitTrap,
      null,
      this
    );
    this.trap12.visible = false;
    this.trap13 = this.physics.add.staticGroup();
    for (var i = 0; i < 1; i++) {
      this.trap13.create(-3936 + (i * 33) / 2.5, -905, "trap.up");
    }
    this.trap13.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap13,
      this.hitTrap,
      null,
      this
    );
    this.trap13.visible = false;
    this.trap14 = this.physics.add.staticGroup();
    for (var i = 0; i < 1; i++) {
      this.trap14.create(-3636 + (i * 33) / 2.5, -905, "trap.up");
    }
    this.trap14.children.iterate((child) => {
      child.setScale(0.4, 0.4);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap14,
      this.hitTrap,
      null,
      this
    );
    this.trap14.visible = false;
    this.trap15 = this.physics.add.staticGroup();
    for (var i = 0; i < 1; i++) {
      this.trap15.create(4200 + (i * 33) / 2.5, -970, "trap.fire");
    }
    this.trap15.children.iterate((child) => {
      child.setScale(1, 1);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap15,
      this.hitTrap,
      null,
      this
    );
    this.trap15.visible = false;
    this.trap16 = this.physics.add.staticGroup();
    for (var i = 0; i < 1; i++) {
      this.trap16.create(4370 + (i * 33) / 2.5, -1100, "trap.fire");
    }
    this.trap16.children.iterate((child) => {
      child.setScale(1, 1);
      child.visible = false;
    });
    this.physics.add.collider(
      this.player,
      this.trap16,
      this.hitTrap,
      null,
      this
    );
    this.trap16.visible = false;
    this.num = 0;
    this.directionTrap2 = -1;
  }
  checkNearTrap() {
    if (this.player.x > 306) {
      this.trap1.visible = true;
      this.trap1.enableBody();
    }
    if (this.player.x > 650 && this.player.y < -287) {
      this.trap2.visible = true;
      this.trap2.enableBody();
    }
    if (this.player.x > 986 && this.player.x > 650 && this.player.y < -287) {
      this.trap3.visible = true;
      this.trap3.enableBody();
    }
    if (this.player.x > 1200 && this.player.y < -350) {
      this.trap4.visible = true;
      this.trap4.enableBody();
    }
    if (this.player.x > 3470 && this.player.y < -224) {
      this.trap5.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x > 1168) {
      this.trap6.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x > 3721 && this.player.y - 192) {
      this.trap7.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x > 3983) {
      this.trap8.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x < -1937 && this.player.x > -1983 && this.player.y > 30) {
      this.trap9.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x < -2050 && this.player.x > -2143 && this.player.y > 180) {
      this.trap10.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (
      this.player.x < -6258 &&
      this.player.x > -6388 &&
      this.player.y < -790
    ) {
      this.trap11.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (
      this.player.x < -4257 &&
      this.player.x > -4352 &&
      this.player.y < -896
    ) {
      this.trap12.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (
      this.player.x < -3867 &&
      this.player.x > -3987 &&
      this.player.y < -896
    ) {
      this.trap13.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (
      this.player.x < -3561 &&
      this.player.x > -3682 &&
      this.player.y < -896
    ) {
      this.trap14.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x < 4224 && this.player.x > 4144 && this.player.y < -960) {
      this.trap15.children.iterate((child) => {
        child.visible = true;
      });
    }
    if (this.player.x < 4392 && this.player.x > 4329 && this.player.y < -1056) {
      this.trap16.children.iterate((child) => {
        child.visible = true;
      });
    }

    if (this.trap2.visible == true) {
      if (this.trap2.x < 630) {
        this.directionTrap2 = 1;
      } else {
        if (this.trap2.x > 800) {
          this.directionTrap2 = -1;
        }
      }
      this.trap2.y = Phaser.Math.Between(-250, -288);
      this.trap2.x += this.directionTrap2;
    }
  }
}
