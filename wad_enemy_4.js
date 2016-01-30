ENEMY_MOVE_VELOCITY = 150;

/**
 * WAD player class
 */
WADEnemy4 = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'enemy');
    this.facing = "right";
    this.leftAnimation = null;
    this.rightAnimation = null;
    this.game = game;
    this.player = null;
};

WADEnemy4.prototype = Object.create(Phaser.Sprite.prototype);
WADEnemy4.prototype.constructor = WADEnemy4;

/**
 * Automatically called by World.update
 */
WADEnemy4.prototype.update = function() {
    this.checkAggro();
};

WADEnemy4.prototype.setPlayer = function(player) {
    this.player = player;
    console.log(this.player);
    console.log(this);
};

WADEnemy4.prototype.checkAggro = function() {
    if(this.player != null) {
        var distance = Math.sqrt(Math.pow((this.player.x - this.x), 2) + Math.pow((this.player.y - this.y), 2));
        console.log(this.player);
        if(distance <= 150) {
            console.log("BRAIN !");
            // Check if player is on left or right
            if(this.player.x > this.x) {
                // Player on right
                console.log('Player on right');
            } else {
                // Player on left
                console.log("Player on left");
            }
        }
    }
    // var fireballs = game.add.group()
    // fireballs.enableBody = true;
    // fireballs.physicsBodyType = Phaser.Physics.ARCADE;
    // fireballs.createMultiple(30, 'fireball');
    // fireballs.forEach(function(fireball){
    //     fireball.animations.add('fireball');
    //     fireball.checkWorldBounds = true;
    //     fireball.outOfBoundsKill = true;
    // }, this);
};

WADEnemy4.prototype.moveLeft = function(){
	this.body.velocity.x = -ENEMY_MOVE_VELOCITY;
	if(!this.facing == "left"){
		this.animations.play(this.leftAnimation);
		this.facing = "left";
	}
};

WADEnemy4.prototype.moveRight = function(){
	this.body.velocity.x = -ENEMY_MOVE_VELOCITY;
	if(!this.facing == "right"){
		this.animations.play(this.rightAnimation);
		this.facing = "right";
	}
};

WADEnemy4.prototype.stop = function(){
	this.body.velocity.x = 0;
}