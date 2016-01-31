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
        this.load.image('inAir', 'assets/AnimLemmy/LemJump/jump_stance.png');

        this.load.spritesheet('player', 'assets/newtest/player.png', 35, 35);
        this.load.spritesheet('door', 'assets/newtest/door.png', 35, 35);

        this.load.image('background', 'assets/newtest/Fond_montagne.png');
        this.load.image('backgroundBuilding', 'assets/newtest/Fond_bureau_2_resized.png');
        this.load.spritesheet('migo', 'assets/newtest/migo.png', 127.5, 107.5);
        this.load.spritesheet('explosion', 'assets/newtest/explosion.png', 200, 200);
        this.load.spritesheet('explosion2', 'assets/newtest/explosion2.png', 200, 200);
        this.load.spritesheet('special', 'assets/newtest/special.png', 200, 85);

        this.load.atlasJSONHash('idle', 'assets/AnimLemmy/LemIdle/idle.png', 'assets/AnimLemmy/LemIdle/idle.json');
        this.load.atlasJSONHash('run', 'assets/AnimLemmy/LemRun/run.png', 'assets/AnimLemmy/LemRun/run.json');

        // Particles
        this.load.image('blood', 'assets/newtest/blood.png');

        // Sounds
        this.load.audio('enemyDie', 'assets/sounds/enemy_die.mp3');
        this.load.audio('enemyShoot', 'assets/sounds/enemy_shoot.mp3');
        this.load.audio('heroShoot', 'assets/sounds/hero_shoot.mp3');
        this.load.audio('heroSpecial', 'assets/sounds/hero_special.mp3');
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

        this.door = this.add.group();
        this.door.enableBody = true;
        map.createFromObjects('Objects', 7, 'door', 0, true, false, this.door);
        this.door = this.door.children[0];
        this.door.open = false;

        this.player = this.add.group();
        this.player.enableBody = true;
        map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player, WADPlayer);
        // map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player);

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
        map.createFromObjects('Livable', 5, 'enemy', 0, true, false, this.enemies, WADEnemy2);
        this.enemies.callAll('setPlayer', this, this.player.children[0]);

        this.player.setAll('enemies', this.enemies);
        this.player = this.player.children[0];
        this.backgroundShift = this.player.x;
        this.camera.follow(this.player);
        this.enemies.setAll('player', this.player);

        // Simulate a keyboard event to remap the gamepad when we load
        // the state, have fun with browser weird stuff !
        var ev = document.createEvent('KeyboardEvent');
        // Send key '13' (= enter)
        ev.initKeyboardEvent(
            'keydown', true, true, window, false, false, false, false, 13, 0);
        document.body.dispatchEvent(ev);

        this.enemyDie = this.add.audio('enemyDie');
        this.enemyShoot = this.add.audio('enemyShoot');
        this.heroShoot = this.add.audio('heroShoot');
        this.heroSpecial = this.add.audio('heroSpecial');
        this.sound.setDecodedCallback([this.enemyDie, this.enemyShoot, this.heroShoot, this.heroSpecial], function(){}, this);
    },

    update: function() {
        this.background.x = this.camera.x;
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.collide(this.player.bloodEmitter, this.layer);
        this.physics.arcade.overlap(this.player, this.door, function(){
            if(this.door.open) {
                this.state.restart();
            }
        }.bind(this));

        var enemy = this.enemies.getFirstAlive();
        if(!enemy) {
            this.door.open = true;
        }
    },

    // shake: function() {
    //     this.camera.x += 4;
    //     this.camera.x -= 4;
    // }
}