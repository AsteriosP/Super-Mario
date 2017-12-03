var levelSucc = function(game){}

levelSucc.prototype = {
    preload: function(game){
       // this.load.spritesheet('tiles', 'assets/super_mario_tiles.png', 16, 16);
        
       // this.load.spritesheet('mario', 'assets/player.png', 8, 13);
    },

    create: function(game){
        map = this.add.tilemap('levelSuc');
	    map.addTilesetImage('tiles', 'tiles');
	    map.setCollisionBetween(8, 15, true, 'solid');
        map.createLayer('background');
        
        var text = this.add.text(256 / 2, 240 / 2 - 40, 'End of Level!!!!!\nscore:' + score,
            { font: "20px Arial", fill: "#ff00ff", align: "center" });
        text.fontWeight = 'bold';
        text.anchor.set(0.5);

	    layer = map.createLayer('solid');
	    layer.resizeWorld();
        vel = 100;
        player = this.add.sprite(16, game.world.height - 48, 'mario');
	    game.physics.arcade.enable(player);
	    player.body.gravity.y = 370;
	    //player.body.collideWorldBounds = true;
	    player.animations.add('walkRight', [ 8, 9, 10, 11], 10, true);
        player.animations.add('walkLeft', [12, 13, 14, 15], 10, true);
        player.body.velocity.x = vel;
        player.body.enable = true;
        game.time.events.add(4000, changeState, this, 'GameMenu');
    },

    update: function(game){
        game.physics.arcade.collide(player, layer);
        //this.time.events.add(Phaser.Timer.SECOND * 4, function () {
            if (player.body.velocity.x < 0){
                player.animations.play('walkLeft');
            }else{
                player.animations.play('walkRight');
            }
            player.body.velocity.x = vel;
    }
}

function changeState(stateID) {
    this.state.start(stateID);
}