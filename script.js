GameTemplate.Game = function (game) {

};

GameTemplate.Game.prototype = {
    preload: function() {
    },

    create: function() {
        // this.plugins.cameraShake = this.plugins.add(Phaser.Plugin.CameraShake);
        console.log(this);
        this.game.plugins.cameraShake = this.game.plugins.add(new Phaser.Plugin.CameraShake(this));
        this.game.plugins.cameraShake.setup({
            shakeRange: 10,
            shakeCount: 10,
            shakeInterval: 20,
            randomShake: false,
            randomizeInterval: true,
            shakeAxis: 'xy'
        });

        this.musicBg = this.add.audio('zik');
        // this.musicBg.loopFull();

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

        this.door = this.add.group();
        this.door.enableBody = true;
        map.createFromObjects('Objects', 7, 'door', 0, true, false, this.door);
        this.door = this.door.children[0];
        this.door.open = false;

        this.player = this.add.group();
        this.player.enableBody = true;
        map.createFromObjects('Livable', 6, 'player', 0, true, false, this.player, WADPlayer);

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

        // Add sounds
        this.enemyDie = this.add.audio('enemyDie');
        this.enemyDie.allowMultiple = true;
        this.enemyShoot = this.add.audio('enemyShoot');
        this.enemyShoot.allowMultiple = true;
        this.heroShoot = this.add.audio('heroShoot');
        this.heroShoot.allowMultiple = true;
        this.heroSpecial = this.add.audio('heroSpecial');
        this.sound.setDecodedCallback([this.enemyDie, this.musicBg, this.enemyShoot, this.heroShoot, this.heroSpecial], function(){}, this);
    },

    update: function() {
        this.background.x = this.camera.x;
        this.physics.arcade.collide(this.player, this.layer);
        this.physics.arcade.collide(this.player.bloodEmitter, this.layer);
        this.physics.arcade.overlap(this.player, this.door, function(){
            if(this.door.open) {
                this.musicBg.stop();
                this.state.start("Game");
            }
        }.bind(this));

        var enemy = this.enemies.getFirstAlive();
        if(!enemy) {
            this.door.open = true;
        }
    },
}