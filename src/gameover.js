var gameOver = function(game){}

gameOver.prototype = {
	// init: function(game){
	// 	alert("You scored: "+this.game.score);
	// },
  	create: function(){
		this.time.events.add(Phaser.Timer.SECOND, function () {
			this.goToMenu();
        }, this);
	},
	goToMenu: function(){
		this.game.state.start("GameMenu");
	}
}
