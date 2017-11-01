var game = new Phaser.Game(256, 240, Phaser.CANVAS, '', {
    preload : preload,
    create : create,
    update : update
}, false, false);

function preload() {

    //  We need this because the assets are on github pages
    //  Remove the next 2 lines if running locally
    //this.load.baseURL = 'https://AsteriosP1.github.io/Super-Mario/';
    //this.load.crossOrigin = 'anonymous';


    this.load.spritesheet('tiles', 'assets/super_mario_tiles.png', 16, 16);
    this.load.spritesheet('goomba', 'assets/goomba.png', 16, 16);
    this.load.spritesheet('mario', 'assets/player.png', 8, 13);
    this.load.spritesheet('coin', 'assets/coin2.png', 16, 16);
    this.load.spritesheet('lives', 'assets/lives.png', 49, 8);
    //this.load.tilemap('level', 'assets/super_mario_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.spritesheet('mashroom', 'assets/mushroom.png', 16, 16);
    this.load.tilemap('level', 'assets/new map.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.audio('backgr', 'audio/bgm.ogg');
    this.load.audio('mcoin', 'audio/smb_coin.wav');
    this.load.audio('Jump', 'audio/smb_jump-small.wav');
    this.load.audio('killing', 'audio/smb_stomp.wav');
    this.load.audio('loses', 'audio/door.wav');
}

function create() {
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#5c94fc';
    game.score = 0;
    game.lives = 5;
    game.bonus = false;


    map = game.add.tilemap('level');
    map.addTilesetImage('tiles', 'tiles');
    map.setCollision([4, 5, 6, 7, 8, 10, 11], true, 'solid');
    //map.setCollision([9, 12], false, 'water');
    map.createLayer('background');

    layer = map.createLayer('solid');
    layer.resizeWorld();

    water = game.add.group();
    water.enableBody = true;
    map.createFromTiles([9, 12], null, '', 'background', water);

    mashrooms = game.add.group();
    mashrooms.enableBody = true;
    mashrooms.alpha = 1.0;
    map.createFromTiles(3, null, 'mashroom', 'stuff', mashrooms);


    coins = game.add.group();
    coins.enableBody = true;
    map.createFromTiles(2, null, 'coin', 'stuff', coins);
    coins.callAll('animations.add', 'animations', 'spin', [ 0, 0, 1, 2, 3,4,5,6,7,8,9,10,11 ], 7, true);
    coins.callAll('animations.play', 'animations', 'spin');

    goombas = game.add.group();
    goombas.enableBody = true;
    map.createFromTiles(1, null, 'goomba', 'stuff', goombas);
    goombas.callAll('animations.add', 'animations', 'walk', [ 0, 1 ], 2, true);
    goombas.callAll('animations.play', 'animations', 'walk');
    goombas.setAll('body.bounce.x', 1);
    goombas.setAll('body.velocity.x', -20);
    goombas.setAll('body.gravity.y', 500);

    // lives::
    game.lives = 5;
    hearts = game.add.sprite(0, 0, 'lives');
    hearts.frame = 5 - game.lives;
    hearts.fixedToCamera = true;

    player = game.add.sprite(16, game.world.height - 48, 'mario');
    game.physics.arcade.enable(player);
    player.body.gravity.y = 370;
    player.body.collideWorldBounds = true;
    player.animations.add('walkRight', [ 8, 9, 10, 11], 10, true);
    player.animations.add('walkLeft', [12, 13, 14, 15], 10, true);
    player.scale.setTo(1.2);
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
    touched = 0;
    music = game.add.sound('backgr');
    mCoin = game.add.audio('mcoin');
    jump = game.add.audio('Jump');
    kills = game.add.audio('killing');
    lose = game.add.audio('loses');
    music.loop = true;
    music.loopFull();
}

function update() {
    game.physics.arcade.collide(player, layer);
    game.physics.arcade.collide(goombas, layer);
    game.physics.arcade.overlap(player, coins, coinOverlap);
    game.physics.arcade.overlap(player, water, waterOverlap);
    game.physics.arcade.overlap(player, mashrooms, mashOverlap);
    if (player.body.onFloor() && killed == true){
            killed = false;
            player.body.enable = true;
            touched = 0;
            player.alpha = 1.0;
    }
    if(touched == 0 && killed == false)
        game.physics.arcade.overlap(player, goombas, goombaOverlap);

    if (player.alpha == 1.0){
        if (player.body.enable) {
            player.body.velocity.x = 0;
            if (cursors.left.isDown) {
                player.body.velocity.x = -120;
                player.animations.play('walkLeft');
                player.goesRight = false;
            } else if (cursors.right.isDown) {
                player.body.velocity.x = 120;
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
    if (player.body.velocity.y != 0) {
        if (player.goesRight){
            player.frame = 10;
        } else{
            player.frame = 13;
        }
    }

    if(hearts.frame == 5)
        alert("the end...");
}

function coinOverlap(player, coin) {
    mCoin.play();
    coin.kill();
    updateScore(10);
}

function goombaOverlap(player, goomba) {
    if (player.body.touching.down) {
        kills.play();
        goomba.animations.stop();
        goomba.frame = 2;
        goomba.body.enable = false;
        player.body.velocity.y = -80;
        game.time.events.add(Phaser.Timer.SECOND, function() {
            goomba.kill();
        });
        updateScore(20);
    } else {    //player killed from a goomba
        if (checkOverlap(goomba, player))
            touched = 1;
        player.alpha = 0.5;
        game.lives = game.lives - 1;
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
        updateScore(-40);
        killed = true;
        hearts.frame = 5 - game.lives;
        player.animations.stop();
    }
}

function updateScore(b) {
    if (game.bonus == false){
        game.score += b;
        text.text= 'SCORE:\n' +  game.score;
    } else {
        game.score += b * 2;
        text.text= 'SCORE: x2\n' +  game.score;
    }
}

function waterOverlap(player, water){
    lose.play();
    game.lives = game.lives - 1;
    hearts.frame = 5 - game.lives;
    player.body.position.x = 594.4;
    player.body.position.y = 192.4;
}

function mashOverlap(player, mashroom) {
    mashroom.kill();
    game.bonus = true;
    updateScore(0);
    game.time.events.add(Phaser.Timer.SECOND * 8, function () {
        game.bonus = false;
        updateScore(0);
    }, this);
}

function checkOverlap(spriteA, spriteB) {
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();
    return Phaser.Rectangle.intersects(boundsA, boundsB);
}
