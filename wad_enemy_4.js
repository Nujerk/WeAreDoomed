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

    this.health = 1;
    this.bullets = game.add.group()
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.forEach(function(bullet){
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;
    }, this);

    this.isReadyToFire = true;
    this.lastShot = 0;
    this.firerate = 200;
    this.bullet_velocity = 500;
    this.range = this.game.rnd.integerInRange(250, 270);
};

WADEnemy4.prototype = Object.create(Phaser.Sprite.prototype);
WADEnemy4.prototype.constructor = WADEnemy4;

/**
 * Automatically called by World.update
 */
WADEnemy4.prototype.update = function() {
    if(this.alive) {
        this.checkAggro();
        this.game.physics.arcade.overlap(this.bullets, this.player, this.onBulletHit);
    }
};

WADEnemy4.prototype.onBulletHit = function(player, bullet) {
    bullet.kill();
    /*player.damage(1);*/
};

WADEnemy4.prototype.setPlayer = function(player) {
    this.player = player;
};

WADEnemy4.prototype.checkAggro = function() {
    if(this.player != null) {
        var distance = Math.sqrt(Math.pow((this.player.x - this.x), 2) + Math.pow((this.player.y - this.y), 2));

        var side = 0;
        // Check if player is on left or right
        if(this.player.x > this.x) {
            var side = 1;
        } else {
            // Player on left
            var side= -1;
        }

        // If player is in range we fire else we try to reach the range value
        if(distance <= this.range) {
            this.body.velocity.x = 0;
            this.fire(side);
        } else {
            this.body.velocity.x = ENEMY_MOVE_VELOCITY * side;
        }
    }
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
};

WADEnemy4.prototype.fire = function(side){
    if(this.isReadyToFire) {
        if(this.bullets.getFirstExists(false)) {
            var bullet = this.bullets.getFirstExists(false);
            bullet.anchor.setTo(0.5, 0.5);
            bullet.reset(this.x, this.y + (this.height / 2));
            // bullet.play('fire', 10, true);
            bullet.body.velocity.x = side * this.bullet_velocity;

            this.isReadyToFire = false;
            this.lastShot = this.game.time.now;
        }
    }

    // Fire cooldown checker
    if(this.game.time.now > this.lastShot + this.firerate) {
        this.isReadyToFire = true;
    }
};
