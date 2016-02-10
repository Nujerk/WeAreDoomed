PLAYER_MOVE_VELOCITY  = 300;
PLAYER_JUMP_VELOCITY  = -500;
PLAYER_INITIAL_LIFE   = 1000;

/**
 * WAD player class
 */
WADPlayer = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'idle');

    this.animations.add('idle');
    this.animations.play('idle', 13, true);

    this.facing = "right";
    this.moving = false;
    this.locked = false;
    this.inputInitialized = false;
    this.weapon = null;

    this.enemies = null;
    this.weapons = null;
    this.leftAnimation = null;
    this.rightAnimation = null;
    this.isAimingUp = false;

    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.body.gravity.y = 1000;
    this.health = PLAYER_INITIAL_LIFE;
    this.body.maxVelocity.y = 500;

    this.game = game;
    game.input.gamepad.start();
    this.pad = game.input.gamepad.pad1;
    this.pad.onConnectCallback = this.inputsInit.bind(this);
    game.input.keyboard.onDownCallback = this.inputsInit.bind(this);

    this.weapon = new WADWeaponGatling(game);

    //  Life display
	var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    this.healthtext = this.game.add.text(10, 5, this.health + "PV" , style);
    this.healthtext.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    this.healthtext.fixedToCamera = true;
    this.healthtext.cameraOffset.setTo(10, 5);

    this.events.onKilled.add(this.playerExplode, this);

    // Particles emitter
    this.bloodEmitter = this.game.add.emitter(0, 0, 1000);
    this.bloodEmitter.setYSpeed(-50, 50);
    this.bloodEmitter.minParticleScale = 0.5;
    this.bloodEmitter.maxParticleScale = 1;
    this.bloodEmitter.bounce.setTo(0, 0);
    this.bloodEmitter.gravity = 150;
    this.bloodEmitter.makeParticles('blood', 0, 1000, 1, true);
};

WADPlayer.prototype = Object.create(Phaser.Sprite.prototype);
WADPlayer.prototype.constructor = WADPlayer;

/**
 * Automatically called by World.update
 */
WADPlayer.prototype.update = function() {

    // Do things on particles
    this.bloodEmitter.forEachExists(function(particle){
        var particleVelocity = 2;

        if(particle.body.angularVelocity > 0) {
            particle.body.angularVelocity -= particleVelocity;
        } else if(particle.body.angularVelocity < 0){
            particle.body.angularVelocity += particleVelocity;
        } else {
            particle.body.angularVelocity = 0;
        }

        if(particle.body.velocity.x > 0) {
            particle.body.velocity.x -= particleVelocity;
        } else if(particle.body.velocity.x < 0){
            particle.body.velocity.x += particleVelocity;
        } else {
            particle.body.velocity.x = 0;
        }
    });

    // this.game.debug.body(this);

	/// Player bullets damage enemies
    this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.onBulletHit);
    this.game.physics.arcade.overlap(this.weapon.specialBullets, this.enemies, this.onBulletHit);

    /// Player and weapon collides together (so that player can pick them up)
    this.game.physics.arcade.overlap(this, this.weapons, this.onWeaponCollide);

    this.weapon.update();

    this.healthtext.text = this.health + "PV";

	if(!this.inputInitialized)
		return;

    console.log(this.body.blocked.down);
    console.log(this.key);

    if(!this.body.blocked.down) {
        this.loadTexture('inAir');
    } else {
        if(this.key == "inAir") {
            this.stop();
        }
    }

	if(this.lockKey.isDown)
		this.lock();
	else if(this.lockKey.isUp)
		this.unlock();

	if(this.rollKey.isDown)
		this.roll();

	if(this.fireKey.isDown)
		this.shoot();
	else if(this.specialKey.isDown)
		this.special();

	if(this.leftKey.isDown)
		this.moveLeft();
	else if(this.rightKey.isDown)
		this.moveRight();
	else if(this.leftKey.isUp && this.rightKey.isUp)
		this.stop();
	else if(this.downKey.isDown)
		this.pickupWeapon();

	if(this.upKey.isDown)
		this.aimUp();
	else if(this.upKey.isUp)
		this.aimReset();

	if(this.jumpKey.isDown)
		this.jump();

    if(this.game.physics.arcade.isPaused){
        if(this.specialKey.isDown) {
            this.game.state.restart();
        }
    }
};

WADPlayer.prototype.onBulletHit = function(bullet, enemy) {
    bullet.kill();
    enemy.damage(1);
};

WADPlayer.prototype.hit = function(direction) {
    this.bloodEmitter.y = this.y + (this.height / 2);

    if(direction == "left") {
        this.bloodEmitter.x = this.x;
        this.bloodEmitter.setXSpeed(-100, -200);
        this.bloodEmitter.start(true, 0, 1, 10);
    } else {
        this.bloodEmitter.x = this.x + this.width;
        this.bloodEmitter.setXSpeed(100, 200);
        this.bloodEmitter.start(true, 0, 0, 10);
    }
};

WADPlayer.prototype.inputsInit = function(){
	this.game.input.keyboard.onDownCallback = null;
	if(!this.pad.connected)
	{
		/// Keyboard inputs
		this.upKey 		= this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.downKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.leftKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.rightKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.fireKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
		this.specialKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		this.jumpKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.lockKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.rollKey 	= this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	}
	else
	{
		/// Pad inputs
	    this.upKey 		= this.pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
	    this.downKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
	    this.leftKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
	    this.rightKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
	    this.fireKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_X);
	    this.specialKey	= this.pad.getButton(Phaser.Gamepad.XBOX360_B);
	    this.jumpKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_A);
	    this.lockKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_LEFT_TRIGGER);
	    this.rollKey 	= this.pad.getButton(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
	}

	this.inputInitialized = true;
};

WADPlayer.prototype.moveLeft = function(){
	if(!this.locked)
		this.body.velocity.x = -PLAYER_MOVE_VELOCITY;

    if(!this.moving || this.facing != "left") {
        this.scale.x = -1;
		this.facing = "left";
        if(!this.locked){
            this.loadTexture('run', 0);
            this.animations.add('run');
            this.animations.play('run', 13, true);
            this.moving = true;
        }
    }
};

WADPlayer.prototype.moveRight = function(){
	if(!this.locked)
		this.body.velocity.x = PLAYER_MOVE_VELOCITY;

    if(!this.moving || this.facing != "right") {
        // DEBUG
        this.scale.x = 1;
		this.facing = "right";
        if(!this.locked) {
            this.loadTexture('run', 0);
            this.animations.add('run');
            this.animations.play('run', 13, true);
            this.moving = true;
        }
    }
};

WADPlayer.prototype.stop = function(){
    if(this.moving) {
        this.loadTexture('idle');
        this.animations.add('idle');
        this.animations.play('idle', 3, true);
    }

	this.body.velocity.x = 0;
    this.moving = false;
};

WADPlayer.prototype.jump = function(){
	if(this.body.velocity.y != 0 || this.locked)
		return;
	this.body.velocity.y = PLAYER_JUMP_VELOCITY;
    this.moving = true;
};

WADPlayer.prototype.shoot = function(){
	this.weapon.shoot(this);
};

WADPlayer.prototype.special = function(){
	this.weapon.special(this);
};

WADPlayer.prototype.roll = function(){
};

WADPlayer.prototype.lock = function(){
	if(this.body.blocked.down)
		this.body.velocity.x = 0;

	this.locked = true;
};

WADPlayer.prototype.unlock = function(){
	this.locked = false;
};

WADPlayer.prototype.pickupWeapon = function(){
};

WADPlayer.prototype.aimUp = function(){
	this.isAimingUp = true;
};

WADPlayer.prototype.aimReset = function(){
	this.isAimingUp = false;
};

WADPlayer.prototype.playerExplode = function(){
	/// End Game
    var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
	var style_2 = { font: "bold 25px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    text = this.game.add.text(0, 0, "YOU DIED. CTHULU RULES THE EARTH.", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    text_2 = this.game.add.text(0, 0, "PRESS B TO RESTART", style_2);

    // Pause the game and wait the player to press on special key button
    this.game.physics.arcade.isPaused=true;

    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    text.setTextBounds(50, 100, 600, 100);
    text_2.setTextBounds(50, 200, 600, 100);
};
