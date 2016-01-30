PLAYER_MOVE_VELOCITY = 150;

/**
 * WAD player class
 */
WADPlayer = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'player');
    this.facing = "right";
    this.leftAnimation = null;
    this.rightAnimation = null;
};

WADPlayer.prototype = Object.create(Phaser.Sprite.prototype);
WADPlayer.prototype.constructor = WADPlayer;

/**
 * Automatically called by World.update
 */
WADPlayer.prototype.update = function() {

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
}