var preloader = function(game){}

preloader.prototype = {
	preload: function(game){

	//  We need this because the assets are on github pages
    //  Remove the next 2 lines if running locally
    //this.load.baseURL = 'https://AsteriosP1.github.io/Super-Mario/';
    //this.load.crossOrigin = 'anonymous';


    this.load.spritesheet('tiles', 'assets/super_mario_tiles.png', 16, 16);
    this.load.spritesheet('goomba', 'assets/goomba.png', 16, 16);
    this.load.spritesheet('mario', 'assets/player.png', 8, 13);
    this.load.spritesheet('coin', 'assets/coin2.png', 16, 16);
    this.load.spritesheet('lives', 'assets/lives.png', 49, 8);
    this.load.spritesheet('mashroom', 'assets/mushroom.png', 16, 16);
	this.load.spritesheet('sea', 'assets/sea2.png', 16, 16);
	this.load.spritesheet('ghost', 'assets/ghosts.png', 16, 16);
	this.load.spritesheet('slime', 'assets/slime.png', 16, 16);
	this.load.spritesheet('finish', 'assets/finish.png', 16, 16);
	this.load.tilemap('levelSuc', 'assets/level_ended.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level2', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('level1', 'assets/super_mario_map_1.json', null, Phaser.Tilemap.TILED_JSON);
		// this.load.tilemap('level', 'assets/new map.json', null, Phaser.Tilemap.TILED_JSON);

    this.load.audio('backgr', ['audio/bgm.mp3','audio/bgm.ogg']);
    this.load.audio('mcoin', 'audio/smb_coin.wav');
    this.load.audio('Jump', 'audio/smb_jump-small.wav');
    this.load.audio('killing', 'audio/smb_stomp.wav');
	this.load.audio('loses', 'audio/door.wav');
	this.load.audio('game_over', 'audio/smb_game_over.wav');
	this.load.audio('stage_clear', 'audio/smb_stage_clear.wav');
	},
  	create: function(game){
		Phaser.Canvas.setImageRenderingCrisp(game.canvas);
		game.scale.pageAlignHorizontally = true;
		game.scale.pageAlignVertically = true;
		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.physics.startSystem(Phaser.Physics.ARCADE);
		//game.scale.setScreenSize(true);


    	music = game.add.audio('backgr');
    	mCoin = game.add.audio('mcoin');
    	jump = game.add.audio('Jump');
    	kills = game.add.audio('killing');
    	lose = game.add.audio('loses');
		gameOver = game.add.audio('game_over');
		// einai ligo dynata
		stageClear = game.add.audio('stage_clear');

		
		game.state.start("GameMenu");
	}
}
