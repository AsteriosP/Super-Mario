var nextLevel = function(game){}
// http://www.mariouniverse.com/sprites/snes/smb3
// https://en.wikipedia.org/wiki/Maze_generation_algorithm
// https://en.wikipedia.org/wiki/Maze_generation_algorithm#Cellular_automaton_algorithms
nextLevel.prototype = {
    preload: function(){

    },

    create: function(){
        var text = this.add.text(256 / 2, 240 / 2, 'Press <Space> to play\nnext Level',
            { font: "20px Arial", fill: "#ffffff", align: "center" });
        text.fontWeight = 'bold';
        text.anchor.set(0.5);
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.startNextLevel, this);
    },

    startNextLevel: function(game){
        levelSelected = levelSelected + 1;
        this.game.state.start('TheGame');
    }
}
