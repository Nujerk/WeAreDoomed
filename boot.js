var GameTemplate = {};

GameTemplate.Boot = function (game) {

};

GameTemplate.Boot.prototype = {

    preload: function () {
        this.stage.backgroundColor = 0x2c3e50;
        this.load.image('preloaderBar', 'assets/newtest/loading.png');
    },

    create: function () {
        this.input.onDown.add(function(){
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.startFullScreen(false);
        }.bind(this));

        this.state.start('Preloader');
    }

};
