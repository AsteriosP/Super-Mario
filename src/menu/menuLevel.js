var menulevel = function(game){}
// http://www.mariouniverse.com/sprites/snes/smb3
// https://en.wikipedia.org/wiki/Maze_generation_algorithm
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Cellular_automaton_algorithms
menulevel.prototype = {
    preload: function(){

    },

    create: function(){
        var text = this.add.text(256 / 2, 240 / 2, 'Press the number you\nwant to play must be (1-2)',
            { font: "20px Arial", fill: "#ffffff", align: "center" });
        text.fontWeight = 'bold';
        text.anchor.set(0.5);
        var oneKey = this.input.keyboard.addKey(Phaser.Keyboard.ONE);
        var twoKey = this.input.keyboard.addKey(Phaser.Keyboard.TWO);
        oneKey.onDown.add(this.startLevel1, this);
        twoKey.onDown.add(this.startLevel2, this);
    },

    startLevel1: function(game){
        levelSelected = 0;
        this.game.state.start('TheGame');
    },
    
    startLevel2: function(game){
        levelSelected = 1;
        this.game.state.start('TheGame');
    }
}
