PLAYER_MOVE_VELOCITY 	= 150;
PLAYER_JUMP_VELOCITY 	= -500;
PLAYER_INITIAL_LIFE 	= 10;

/**
 * WAD player class
 */
WADPlayer = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'player');
    
    this.facing = "right";
    this.locked = false;
    this.inputInitialized = false;
    this.weapon = null;

    this.enemies = null;
    this.weapons = null;
    this.leftAnimation = null;
    this.rightAnimation = null;

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

    this.events.onKilled.add(this.playerExplode, this);
};

WADPlayer.prototype = Object.create(Phaser.Sprite.prototype);
WADPlayer.prototype.constructor = WADPlayer;

/**
 * Automatically called by World.update
 */
WADPlayer.prototype.update = function() {

	/// Player bullets damage enemies
    this.game.physics.arcade.overlap(this.weapon.bullets, this.enemies, this.onBulletHit);

    /// Player and weapon collides together (so that player can pick them up)
    this.game.physics.arcade.overlap(this, this.weapons, this.onWeaponCollide);

    this.weapon.update();

	if(!this.inputInitialized)
		return;

	if(this.leftKey.isDown)
		this.moveLeft();
	else if(this.rightKey.isDown)
		this.moveRight();
	else if(this.leftKey.isUp || this.rightKey.isUp)
		this.stop();
	else if(this.downKey.isDown)
		this.pickupWeapon();
	
	if(this.upKey.isDown)
		this.aimUp();
	else if(this.upKey.isUp)
		this.aimReset();
	
	if(this.fireKey.isDown)
		this.shoot();
	else if(this.specialKey.isDown)
		this.special();
	
	if(this.jumpKey.isDown)
		this.jump();

	if(this.lockKey.isDown)
		this.lock();
	else if(this.lockKey.isUp)
		this.unlock();

	if(this.rollKey.isDown)
		this.roll();
};

WADPlayer.prototype.onBulletHit = function(bullet, enemy) {
    bullet.kill();
    enemy.damage(1);
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
	if(!this.locked);
		this.body.velocity.x = -PLAYER_MOVE_VELOCITY;

	if(this.facing != "left"){
		this.animations.play(this.leftAnimation);
		this.facing = "left";
	}
};

WADPlayer.prototype.moveRight = function(){
	if(!this.locked)
		this.body.velocity.x = PLAYER_MOVE_VELOCITY;

	if(this.facing != "right"){
		this.animations.play(this.rightAnimation);
		this.facing = "right";
	}
};

WADPlayer.prototype.stop = function(){
	this.body.velocity.x = 0;
};

WADPlayer.prototype.jump = function(){
	if(this.body.velocity.y != 0)
		return;
	this.body.velocity.y = PLAYER_JUMP_VELOCITY;
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
	if(this.locked == false)
		this.locked = true;
};

WADPlayer.prototype.unlock = function(){
	if(this.locked == true)
		this.locked = false;
};

WADPlayer.prototype.pickupWeapon = function(){
};

WADPlayer.prototype.aimUp = function(){
};

WADPlayer.prototype.aimReset = function(){
};

WADPlayer.prototype.playerExplode = function(){
	/// End Game
	var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

    //  The Text is positioned at 0, 100
    text = this.game.add.text(0, 0, "YOU DIED. CTHULU RULES THE EARTH.", style);
    text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    text.setTextBounds(50, 100, 600, 100);
};