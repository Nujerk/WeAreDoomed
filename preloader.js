
GameTemplate.Preloader = function (game) {

    this.preloadBar = null;

    this.ready = false;

};

GameTemplate.Preloader.prototype = {

    preload: function () {

        this.preloadBar = this.add.sprite(0, 0, 'preloaderBar');

        //  This sets the preloadBar sprite as a loader sprite.
        //  What that does is automatically crop the sprite from 0 to full-width
        //  as the files below are loaded in.
        this.load.setPreloadSprite(this.preloadBar);

        //  Here we load the rest of the assets our game needs.
        //  As this is just a Project Template I've not provided these assets, swap them for your own.
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

        // Add sounds
        // this.enemyDie = this.add.audio('enemyDie');
        // this.enemyShoot = this.add.audio('enemyShoot');
        // this.heroShoot = this.add.audio('heroShoot');
        // this.heroSpecial = this.add.audio('heroSpecial');
        // this.sound.setDecodedCallback([this.enemyDie, this.enemyShoot, this.heroShoot, this.heroSpecial], function(){}, this);
    },

    create: function () {
        //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
        this.preloadBar.cropEnabled = false;
    },

    update: function () {

        //  You don't actually need to do this, but I find it gives a much smoother game experience.
        //  Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
        //  You can jump right into the menu if you want and still play the music, but you'll have a few
        //  seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
        //  it's best to wait for it to decode here first, then carry on.

        //  If you don't have any music in your game then put the game.state.start line into the create function and delete
        //  the update function completely.

        if (this.cache.isSoundDecoded('enemyDie') && this.cache.isSoundDecoded('enemyShoot') && this.cache.isSoundDecoded('heroShoot') && this.cache.isSoundDecoded('heroSpecial') && this.ready == false) {
            this.ready = true;
            this.state.start('Game');
        }

    }

};
