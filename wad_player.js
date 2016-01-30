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
};

WADPlayer.prototype = Object.create(Phaser.Sprite.prototype);
WADPlayer.prototype.constructor = WADPlayer;

/**
 * Automatically called by World.update
 */
WADPlayer.prototype.update = function() {
	if(this.leftKey.isDown || this.buttonDPadLeft.isDown)
		this.moveLeft();
	else if(this.rightKey.isDown || this.buttonDPadRight.isDown)
		this.moveRight();
	else if(this.leftKey.isUp || this.rightKey.isUp || this.buttonDPadLeft.isUp || this.buttonDPadRight.isUp)
		this.stop();
};

WADPlayer.prototype.inputsInit = function(game){
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

	/// Pad inputs
	game.input.gamepad.start();
    pad = game.input.gamepad.pad1;

    this.buttonA 			= pad.getButton(Phaser.Gamepad.XBOX360_A);
    this.buttonB 			= pad.getButton(Phaser.Gamepad.XBOX360_B);
    this.buttonX 			= pad.getButton(Phaser.Gamepad.XBOX360_X);
    this.buttonY 			= pad.getButton(Phaser.Gamepad.XBOX360_Y);
    this.buttonDPadLeft 	= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
    this.buttonDPadRight 	= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
    this.buttonDPadUp 		= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
    this.buttonDPadDown 	= pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);
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