var GameTemplate = {};

GameTemplate.Game = function (game) {

};

GameTemplate.Game.prototype = {
    preload: function() {
        //this.load.pack("main", "assets/main_pack.json");
        this.load.tilemap('map', 'assets/newtest/newtest.json', null, Phaser.Tilemap.TILED_JSON);

        this.load.image('enemy', 'assets/newtest/enemy.png');
        this.load.image('test 1', 'assets/newtest/tileset_test1.png');
        this.load.image('bullet', 'assets/newtest/bullet.png');
        this.load.image('bulletPlayer', 'assets/newtest/bullet_player.png');
        this.load.spritesheet('player', 'assets/newtest/player.png', 35, 35);
        this.load.image('background', 'assets/newtest/Fond_montagne.png');
        this.load.image('backgroundBuilding', 'assets/newtest/Fond_bureau_2_resized.png');
        this.load.spritesheet('migo', 'assets/newtest/migo.png', 127.5, 107.5);
        this.load.spritesheet('explosion', 'assets/newtest/explosion.png', 200, 200);
        this.load.spritesheet('explosion2', 'assets/newtest/explosion2.png', 200, 200);
    },

    create: function() {
        // Keep original size
        this.input.onDown.add(function(){
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.scale.startFullScreen(false);
        }.bind(this));

        this.background = this.add.tileSprite(0,
                                         0,
                                         1920,
                                         1080,
                                         "background");
        // background.scale.setTo(1, 0.5);

        this.physics.arcade.gravity.y = 300;

        var map = this.add.tilemap("map");
        map.addTilesetImage("enemy");
        map.addTilesetImage("test 1");

        this.layer = map.createLayer("Tile Layer 1");
        map.setCollisionBetween(1, 10000, true, "Tile Layer 1");
        this.layer.resizeWorld();

        this.physics.startSystem(Phaser.Physics.ARCADE);

        backgroundBuilding = this.add.tileSprite(120,
                                                 0,
                                                 2320,
                                                 1080,
                                                 "backgroundBuilding");

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.player = this.add.group();
        this.player.enableBody = true;
        map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player, WADPlayer);
        // map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player);

        // var migo = this.add.sprite(300, 200, 'migo');

        // //  Here we add a new animation called 'walk'
        // //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
        // var walk = migo.animations.add('walk');

        // //  And this starts the animation playing by using its key ("walk")
        // //  30 is the frame rate (30fps)
        // //  true means it will loop when it finishes
        // migo.animations.play('walk', 10, true);

        // var explosion2 = this.add.sprite(800, 400, 'explosion2');

        // //  Here we add a new animation called 'walk'
        // //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
        // var walk = explosion2.animations.add('walk');

        // //  And this starts the animation playing by using its key ("walk")
        // //  30 is the frame rate (30fps)
        // //  true means it will loop when it finishes
        // explosion2.animations.play('walk', 24, true);

        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        map.createFromObjects('Livable', 5, 'enemy', 0, true, false, this.enemies, WADEnemy4);
        this.enemies.callAll('setPlayer', this, this.player.children[0]);

        this.player.setAll('enemies', this.enemies);
        this.player = this.player.children[0];
        this.backgroundShift = this.player.x;
        this.camera.follow(this.player);
        // this.enemies.setAll('player', this.player);
    },

    update: function() {
        this.background.x = this.camera.x;
        this.physics.arcade.collide(this.player, this.layer);
        // background.tilePosition.x -= 2;
    },
}