var GameTemplate = {};

GameTemplate.Game = function (game) {

};

GameTemplate.Game.prototype = {
    preload: function() {
        this.load.pack("main", "assets/main_pack.json");
    },

    create: function() {
        // Keep original size
        this.input.onDown.add(function(){
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.startFullScreen(false);
        }.bind(this));

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.physics.arcade.gravity.y = 1500;

        var map = this.add.tilemap("stage1");
        map.addTilesetImage("test1", "tileset_test1");

        map.setCollisionBetween(0, 6569);

        layer = map.createLayer("Tile Layer 1");

        enemies = this.add.group();
        enemies.enableBody = true;

        map.createFromObjects('Livables', 8, 'enemy', 0, true, false, enemies);

        // sprite = this.add.sprite(0, 0, "player");
    },

    update: function() {
    },
}
