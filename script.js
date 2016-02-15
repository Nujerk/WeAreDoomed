GameTemplate.Game = function (game) {

};

GameTemplate.Game.prototype = {
    preload: function() {
    },

    create: function() {
        // Best music, EVER !
        this.musicBg = this.add.audio('zik');
        this.musicBg.loopFull(0.4);

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

        // Add the door
        this.door = this.add.group();
        this.door.enableBody = true;
        map.createFromObjects('Objects', 7, 'door', 0, true, false, this.door, WADDoor);
        this.door = this.door.children[0];
        this.door.open = false;

        // Add the player
        this.player = this.add.group();
        this.player.enableBody = true;
        map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player, WADPlayer);

        // Add all the enemies
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        map.createFromObjects('Livable', 5, 'enemy', 0, true, false, this.enemies, WADEnemy2);
        map.createFromObjects('Livable', 8, 'enemy2', 0, true, false, this.enemies, WADEnemy4);
        this.enemies.callAll('setPlayer', this, this.player.children[0]);
        this.door.setEnemies(this.enemies);

        this.player.setAll('enemies', this.enemies);
        this.player = this.player.children[0];
        this.backgroundShift = this.player.x;
        this.enemies.setAll('player', this.player);
        this.game.shaking = false;

        // Simulate a keyboard event to remap the gamepad when we load
        // the state, have fun with browser weird stuff !
        var keyEvDict = new Object();
        keyEvDict.key = 'Enter';
        var ev = new KeyboardEvent('KeyboardEvent', keyEvDict);
        document.body.dispatchEvent(ev);

        // Add sounds
        this.enemyDie = this.add.audio('explosionSound');
        this.enemyDie.allowMultiple = true;
        this.enemyShoot = this.add.audio('enemyShoot');
        this.enemyShoot.allowMultiple = true;
        this.heroShoot = this.add.audio('heroShoot');
        this.heroShoot.allowMultiple = true;
        this.heroSpecial = this.add.audio('heroSpecial');
        this.sound.setDecodedCallback([this.enemyDie, this.musicBg, this.enemyShoot, this.heroShoot, this.heroSpecial], function(){}, this);

        this.camera.bounds = null;
    },

    update: function() {
        if(!this.game.shaking)
        {
            var halfCamera = 1920 / 2;
            var sceneWidth = 2320 + 240;
            if(this.player.x >= halfCamera && this.player.x <= sceneWidth - halfCamera)
                this.camera.x = this.player.x - halfCamera;
            else if(this.player.x < halfCamera)
                this.game.camera.x = 0;
            else
                this.game.camera.x = sceneWidth - 1920;
            this.game.camera.y = 0;
        }

        this.background.x = this.camera.x;
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.collide(this.player.bloodEmitter, this.layer);
        this.physics.arcade.overlap(this.player, this.door, function(){
            if(this.door.open) {
                this.musicBg.stop();
                this.state.start("Game");
            }
        }.bind(this));
    },
}