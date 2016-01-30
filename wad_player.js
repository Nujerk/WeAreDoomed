PLAYER_MOVE_VELOCITY = 150;

/**
 * WAD player class
 */
WADPlayer = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'player');
    this.facing = "right";
    this.leftAnimation = null;
    this.rightAnimation = null;
    this.inputsInit(game);
    game.input.gamepad.start();
    this.pad = null;
    if(game.input.gamepad.pad1.connected)
		this.pad = game.input.gamepad.pad1;
};

WADPlayer.prototype = Object.create(Phaser.Sprite.prototype);
WADPlayer.prototype.constructor = WADPlayer;

/**
 * Automatically called by World.update
 */
WADPlayer.prototype.update = function() {
	if(this.leftKey.isDown)
		this.moveLeft();
	else if(this.rightKey.isDown)
		this.moveRight();
	else if(this.leftKey.isUp || this.rightKey.isUp)
		this.stop();
};

WADPlayer.prototype.inputsInit = function(game){
	if(this.pad == null)
	{
		/// Keyboard inputs
		this.upKey 		= game.input.keyboard.addKey(Phaser.Keyboard.Z);
		this.downKey 	= game.input.keyboard.addKey(Phaser.Keyboard.S);
		this.leftKey 	= game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.rightKey 	= game.input.keyboard.addKey(Phaser.Keyboard.D);
		this.fireKey 	= game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
		this.specialKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
		this.jumpKey 	= game.input.keyboard.addKey(Phaser.Keyboard.A);
		this.lockKey 	= game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.rollKey 	= game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	}
	else
	{
		/// Pad inputs
	    this.upKey 		= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
	    this.downKey 	= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
	    this.leftKey 	= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
	    this.rightKey 	= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
	    this.fireKey 	= pad.getButton(Phaser.Gamepad.XBOX360_X);
	    this.specialKey	= pad.getButton(Phaser.Gamepad.XBOX360_B);
	    this.jumpKey 	= pad.getButton(Phaser.Gamepad.XBOX360_A);
	    this.lockKey 	= pad.getButton(Phaser.Gamepad.XBOX360_XBOX360_LEFT_TRIGGER);
	    this.rollKey 	= pad.getButton(Phaser.Gamepad.XBOX360_XBOX360_RIGHT_TRIGGER);
	}
};

WADPlayer.prototype.moveLeft = function(){
	this.body.velocity.x = -PLAYER_MOVE_VELOCITY;
	if(!this.facing == "left"){
		this.animations.play(this.leftAnimation);
		this.facing = "left";		
	}
};

WADPlayer.prototype.moveRight = function(){
	this.body.velocity.x = -PLAYER_MOVE_VELOCITY;
	if(!this.facing == "right"){
		this.animations.play(this.rightAnimation);
		this.facing = "right";		
	}
};

WADPlayer.prototype.stop = function(){
	this.body.velocity.x = 0;
};