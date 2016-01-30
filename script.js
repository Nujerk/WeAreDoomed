var GameTemplate = {};

GameTemplate.Game = function (game) {

};

GameTemplate.Game.prototype = {
    preload: function() {
        //this.load.pack("main", "assets/main_pack.json");
        this.load.tilemap('map', 'assets/newtest/newtest.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('enemy', 'assets/newtest/enemy.png');
        this.load.image('test 1', 'assets/newtest/tileset_test1.png');
        this.load.spritesheet('player', 'assets/newtest/player.png', 35, 35);
    },

    create: function() {
        // Keep original size
        // this.input.onDown.add(function(){
        //     this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //     this.scale.startFullScreen(false);
        // }.bind(this));

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.physics.arcade.gravity.y = 1500;

        var map = this.add.tilemap("map");
        map.addTilesetImage("enemy");
        map.addTilesetImage("test 1");

        map.setCollisionBetween(0, 6569);

        var layer = map.createLayer("Tile Layer 1");
        layer.resizeWorld();

        this.physics.startSystem(Phaser.Physics.ARCADE);


        this.player = this.add.group();
        this.player.enableBody = true;
        // map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player, WADPlayer);
        map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player);

        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        map.createFromObjects('Livable', 5, 'enemy', 0, true, false, this.enemies, WADEnemy4);
        this.enemies.callAll('setPlayer', this, this.player.children[0]);
        console.log(this.enemies);
        // for(enemy in this.enemies.children) {

        // }
    },

    update: function() {
        // for(enemy in this.enemies) {
        //     // console.log(enemy.checkAggro());
        // }
    },
}
