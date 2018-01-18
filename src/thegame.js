var theGame = function(game){};


var lives = 5;
var bonus = false;
var teleported = false;
var levels = ['assets/super_mario_map_1.json', 'assets/map2.json']
var confused = false;

theGame.prototype = {
    preload: function(game){
		this.load.tilemap('level', levels[levelSelected], null, Phaser.Tilemap.TILED_JSON);
        // game.load.script('BlurX', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurX.js');
        // game.load.script('BlurY', 'https://cdn.rawgit.com/photonstorm/phaser/master/v2/filters/BlurY.js');
        music.loopFull();
    },

  	create: function(game){
        if (levelSelected == 0){
            score = 0;
        }
		game.stage.backgroundColor = '#5c94fc';
	    score = 0;
	    lives = 5;
	    bonus = false;
	    teleported = false;
        vel = 120;
	    map = this.add.tilemap('level');
  	    map.addTilesetImage('tiles', 'tiles');
  	    map.setCollisionBetween(8, 15, true, 'solid');
  	    map.createLayer('background');

	    layer = map.createLayer('solid');
	    layer.resizeWorld();

      water = game.add.group();
      water.enableBody = true;
	    map.createFromTiles(4, null, 'sea', 'stuff', water);

	    mashrooms = game.add.group();
	    mashrooms.enableBody = true;
	    //mashrooms.alpha = 1.0;
	    map.createFromTiles(3, null, 'mashroom', 'stuff', mashrooms);

	    coins = game.add.group();
	    coins.enableBody = true;
	    map.createFromTiles(2, null, 'coin', 'stuff', coins);
	    coins.callAll('animations.add', 'animations', 'spin', [ 0, 0, 1, 2, 3,4,5,6,7,8,9,10,11 ], 7, true);
        coins.callAll('animations.play', 'animations', 'spin');

        ghosts = game.add.group();
        ghosts.enableBody = true;
        map.createFromTiles(5, null, 'ghost', 'stuff', ghosts);
        ghosts.callAll('animations.add', 'animations', 'walk', true);
        ghosts.setAll('body.bounce.x', 1);
        ghosts.setAll('body.velocity.x', -20);

        slimes = game.add.group();
        slimes.enableBody = true;
        map.createFromTiles(6, null, 'slime', 'stuff', slimes);
        slimes.callAll('animations.add', 'animations', 'walk', [ 0, 1 ], 2, true);
	    slimes.callAll('animations.play', 'animations', 'walk');
	    slimes.setAll('body.bounce.x', 1);
	    slimes.setAll('body.velocity.x', -20);
        slimes.setAll('body.gravity.y', 500);

        finishes = game.add.group();
        finishes.enableBody = true;
	    finishes.alpha = 0.001;
	    map.createFromTiles(7, null, 'finish', 'stuff', finishes);

	    goombas = game.add.group();
	    goombas.enableBody = true;
	    map.createFromTiles(1, null, 'goomba', 'stuff', goombas);
	    goombas.callAll('animations.add', 'animations', 'walk', [ 0, 1 ], 2, true);
	    goombas.callAll('animations.play', 'animations', 'walk');
	    goombas.setAll('body.bounce.x', 1);
	    goombas.setAll('body.velocity.x', -20);
	    goombas.setAll('body.gravity.y', 500);

	    // lives::
	    lives = 5;
	    hearts = game.add.sprite(0, 0, 'lives');
	    hearts.frame = 5 - lives;
	    hearts.fixedToCamera = true;

	    player = game.add.sprite(16, game.world.height - 48, 'mario');
	    game.physics.arcade.enable(player);
	    player.body.gravity.y = 370;
	    player.body.collideWorldBounds = true;
	    player.animations.add('walkRight', [ 8, 9, 10, 11], 10, true);
	    player.animations.add('walkLeft', [12, 13, 14, 15], 10, true);
	    //player.scale.setTo(1.2);
	    player.goesRight = true;

	    game.camera.follow(player);
	    cursors = game.input.keyboard.createCursorKeys();
	    text = game.add.text(10, 10, 'SCORE:\n',{
	        font: "10px Arial",
	        fill: "#ffffff",
	        align: "center"
	    });
	    text.fontWeight = 'bold';
	    text.fixedToCamera = true;
	    text.z = 10;
	    killed = false;
      touchedgoomba = 0;
      touchedslime = 0;
      //game.sound.stopAll();
	},

    update: function(game) {
        game.physics.arcade.collide(player, layer);
        game.physics.arcade.collide(goombas, layer);
        game.physics.arcade.collide(slimes, layer);
        game.physics.arcade.collide(ghosts, layer);
        game.physics.arcade.overlap(player, coins, this.coinOverlap.bind(this));
        game.physics.arcade.overlap(player, water, this.waterOverlap.bind(this));
        game.physics.arcade.overlap(player, mashrooms, this.mashOverlap.bind(this));
        game.physics.arcade.overlap(player, ghosts, this.ghostOverlap.bind(this));
        game.physics.arcade.overlap(player, finishes, this.finishOverlap.bind(this));

        if (player.body.onFloor() && killed == true){
            killed = false;
            player.body.enable = true;
            touchedgoomba = 0;
            player.alpha = 1.0;
        }

        if (touchedslime == 0 && killed == false){
          game.physics.arcade.overlap(player, slimes, this.slimeOverlap.bind(this));

          touchedslime = 0;
        }

        if(touchedgoomba == 0 && killed == false){
            game.physics.arcade.overlap(player, goombas, this.goombaOverlap.bind(this));
        }

        if (!confused){
            if (player.alpha == 1.0){
                if (player.body.enable) {
                    player.body.velocity.x = 0;
                    if (cursors.left.isDown) {
                        player.body.velocity.x = -vel;
                        player.animations.play('walkLeft');
                        player.goesRight = false;
                    } else if (cursors.right.isDown) {
                        player.body.velocity.x = vel;
                        player.animations.play('walkRight');
                        player.goesRight = true;
                    } else {
                        player.animations.stop();
                        if (player.goesRight)
                            player.frame = 11;
                        else
                            player.frame = 15;
                    }

                    if (cursors.up.isDown && player.body.onFloor()) {
                        player.body.velocity.y = -200;
                        jump.play();
                        player.animations.stop();
                    }
                }
            }
        }else{
            if (player.alpha == 1.0){
                if (player.body.enable) {
                    player.body.velocity.x = 0;
                    if (cursors.right.isDown) {// goes left
                        player.body.velocity.x = -vel;
                        player.animations.play('walkLeft');
                        player.goesRight = true;
                    } else if (cursors.left.isDown) { // goes right
                        player.body.velocity.x = vel;
                        player.animations.play('walkRight');
                        player.goesRight = false;
                    } else {
                        player.animations.stop();
                        if (player.goesRight)
                            player.frame = 11;
                        else
                            player.frame = 15;
                    }

                    if (cursors.down.isDown && player.body.onFloor()) {
                        player.body.velocity.y = -200;
                        jump.play();
                        player.animations.stop();
                    }
                }
            }
        }


        if (player.body.velocity.y != 0) {
            if (player.goesRight){
                player.frame = 10;
            } else{
                player.frame = 13;
            }
        }
        if (game.input.keyboard.isDown(Phaser.KeyCode.T) && !game.teleported){
            player.body.position.x = 1284;
            player.body.position.y = 176.4;
            //game.teleported = true;
        }
        if(hearts.frame == 5){
            console.log(score);
            game.sound.stopAll();
            gameOver.play();
            this.game.state.start("GameOver");
            played = false;
        }
    },
        //1284, y: 176.4
    coinOverlap: function(player, coin) {
        mCoin.play();
        coin.kill();
        this.updateScore(10);
    },

    goombaOverlap: function(player, goomba) {
        if (player.body.touching.down) {
            kills.play();
            goomba.animations.stop();
            goomba.frame = 2;
            goomba.body.enable = false;
            player.body.velocity.y = -80;
            this.time.events.add(Phaser.Timer.SECOND, function() {
                goomba.kill();
            });
            this.updateScore(20);
        } else {    //player killed from a goomba
            if (this.checkOverlap(goomba, player)) {
                touchedgoomba = 1;
                player.alpha = 0.5;
                lives = lives - 1;
                lose.play();
                if (player.goesRight){
                    player.frame = 11;
                    player.body.velocity.y = -50;
                    player.body.velocity.x = -180;
                }else {
                    player.frame = 15;
                    player.body.velocity.y = -50;
                    player.body.velocity.x = 180;
                }
                this.updateScore(-40);
                killed = true;
                hearts.frame = 5 - lives;
                player.animations.stop();
            }
        }
    },

    updateScore: function(b) {
        if (bonus == false){
            score += b;
            text.text= 'SCORE:\n' +  score;
        } else {
            score += b * 2;
            text.text= 'SCORE: x2\n' +  score;
        }
    },

    waterOverlap: function(player, water){
        lose.play();
        lives = lives - 1;
        hearts.frame = 5 - lives;
        player.body.position.x = 594.4;
        player.body.position.y = 192.4;
    },

    mashOverlap: function(player, mashroom) {
        mashroom.kill();
        bonus = true;
        this.updateScore(0);
        this.time.events.add(Phaser.Timer.SECOND * 8, function () {
            bonus = false;
            this.updateScore(0);
        }, this);
    },

    finishOverlap: function(player, finish){
        if(cursors.down.isDown){
            this.sound.stopAll();
            //stageClear.play();
            if (levelSelected === 1){
                this.time.events.add(Phaser.Timer.SECOND, function (){
                    this.state.start('LevelSuccess');
                }, this);
            }else {
                played = true;
                this.state.start('NextLevelMenu');
            }
            //this.state.start('GameMenu');
        }
    },

    slimeOverlap: function(player, slime){
      if (this.checkOverlap(slime, player)) {
        if (player.goesRight){
            player.frame = 11;
            player.body.velocity.y = -50;
            player.body.velocity.x = -180;
        }else {
            player.frame = 15;
            player.body.velocity.y = -50;
            player.body.velocity.x = 180;
        }
        touchedslime = 1;
        player.alpha = 0.5;
        lives = lives - 1;
        lose.play();
        this.stage.backgroundColor = '#66cc00';
        player.body.gravity.y = 1000;
        vel = 10;
        this.time.events.add(Phaser.Timer.SECOND * 4, function () {
          this.stage.backgroundColor = '#5c94fc';
          player.body.gravity.y = 370;
          vel = 120;
        }, this);
      }
        this.updateScore(-40);
        killed = true;
        hearts.frame = 5 - lives;
        player.animations.stop();
      // player.body.gravity.y = 370;
    },

    checkOverlap: function(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB);
    },

    ghostOverlap: function(player, ghost) {
        this.camera.flash(0x0000ff, 500);
        confused = true;
        this.stage.backgroundColor = '#0000ff';
        this.time.events.add(Phaser.Timer.SECOND * 3, function() {
            this.stage.backgroundColor = '#5c94fc';
            confused = false;
        }, this);
    }
};
