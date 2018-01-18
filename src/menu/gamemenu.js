var levelSelected = 0;
var gameMenu = function(game){}
// http://perplexingtech.weebly.com/game-dev-blog/using-states-in-phaserjs-javascript-game-developement
// http://www.emanueleferonato.com/2014/08/28/phaser-tutorial-understanding-phaser-states/
gameMenu.prototype = {
    preload: function(){
        this.load.image('logo', 'assets/logo.png'); // https://www.mariowiki.com/images/0/09/SMW96US.png

    },
    create: function(){
        var text = this.add.text(256 / 2, 240 / 2, 'Press <Space> to start\nPress <S> to level select',
            { font: "20px Arial", fill: "#ffffff", align: "center" });
        text.fontWeight = 'bold';
        text.anchor.set(0.5);
        im = this.add.sprite(256 / 2, 50, 'logo');
        im.anchor.x = 0.5;
        im.anchor.y = 0.5;

        this.stage.backgroundColor = '#5c94fc';
        console.log(this.camera.view);
        var sKey = this.input.keyboard.addKey(Phaser.Keyboard.S);
        var spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.start, this);
        sKey.onDown.add(this.levelSelect, this);
        console.log('hi1');
        // this.start();
    },

    start: function(game){
        game.levelSelected = 0;
        console.log('geia');
        this.game.state.start('TheGame');
    },

    levelSelect: function(game){
        this.game.state.start('LevelSelect');
    }

}
