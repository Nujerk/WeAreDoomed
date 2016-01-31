ENEMY_MOVE_VELOCITY = 150;

/**
 * WAD player class
 */
WADEnemy2 = function (game, x, y) {

    // var migo = this.add.sprite(300, 200, 'migo');
    // //  Here we add a new animation called 'walk'
    // //  Because we didn't give any other parameters it's going to make an animation from all available frames in the 'mummy' sprite sheet
    // this.animations.add('walk');

    // //  And this starts the animation playing by using its key ("walk")
    // //  30 is the frame rate (30fps)
    // //  true means it will loop when it finishes
    // migo.animations.play('walk', 10, true);

    Phaser.Sprite.call(this, game, x, y, 'migo');
    this.animations.add('walk');
    this.animations.play('walk', 10, true);

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
    this.firerate = 1600;
    this.bullet_velocity = 500;
    this.range = this.game.rnd.integerInRange(400, 500);
};

WADEnemy2.prototype = Object.create(Phaser.Sprite.prototype);
WADEnemy2.prototype.constructor = WADEnemy2;

/**
 * Automatically called by World.update
 */
WADEnemy2.prototype.update = function() {
    if(this.alive) {
        this.checkAggro();
    }
    this.game.physics.arcade.overlap(this.bullets, this.player, this.onBulletHit, null, this);
};

WADEnemy2.prototype.onBulletHit = function(player, bullet) {
    bullet.kill();
    player.hit(this.facing);
    player.damage(1);
};

WADEnemy2.prototype.damage = function(amount) {
    if (this.alive) {
        this.health -= amount;

        if (this.health <= 0) {
            this.kill();
            if(this.facing == "right") {
                var explosion2 = this.game.add.sprite(this.x + this.width, this.y - (this.height / 2), 'explosion2');
            } else {
                var explosion2 = this.game.add.sprite(this.x, this.y - (this.height / 2), 'explosion2');
            }

            var walk = explosion2.animations.add('walk');
            explosion2.animations.play('walk', 24, false, true);
        }
    }

    return this;
};

WADEnemy2.prototype.setPlayer = function(player) {
    this.player = player;
};

WADEnemy2.prototype.checkAggro = function() {
    if(this.player != null) {
        var distance = Math.sqrt(Math.pow((this.player.x - this.x), 2) + Math.pow((this.player.y - this.y), 2));

        var side = 0;
        // Check if player is on left or right
        if(this.player.x > this.x) {
            var side = 1;
            this.scale.x = - 1;
            this.facing = "right";
        } else {
            // Player on left
            var side= -1;
            this.scale.x = 1;
            this.facing = "left";
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

WADEnemy2.prototype.moveLeft = function(){
	this.body.velocity.x = -ENEMY_MOVE_VELOCITY;
	if(!this.facing == "left") {
		this.scale.x = - 1;
        this.animations.play(this.leftAnimation);
		this.facing = "left";
	}
};

WADEnemy2.prototype.moveRight = function(){
	this.body.velocity.x = -ENEMY_MOVE_VELOCITY;
	if(!this.facing == "right"){
        this.scale.x = 1;
		this.animations.play(this.rightAnimation);
		this.facing = "right";
	}
};

WADEnemy2.prototype.stop = function(){
    this.body.velocity.x = 0;
};

WADEnemy2.prototype.fire = function(side){
    if(this.isReadyToFire) {
        if(this.bullets.getFirstExists(false)) {
            var bullet = this.bullets.getFirstExists(false);
            bullet.anchor.setTo(0.5, 0.5);
            bullet.reset(this.x + this.width, this.y + (this.height / 2));
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