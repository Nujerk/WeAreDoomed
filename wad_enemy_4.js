ENEMY_MOVE_VELOCITY = 150;

/**
 * WAD player class
 */
WADEnemy4 = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'cultist');
    this.animations.add('walk',[1,2,3,4,3,2]);
    this.animations.add('shoot',[4,5,6,5,4]);
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

WADEnemy4.prototype = Object.create(Phaser.Sprite.prototype);
WADEnemy4.prototype.constructor = WADEnemy4;

/**
 * Automatically called by World.update
 */
WADEnemy4.prototype.update = function() {
    if(this.alive) {
        this.checkAggro();
    }
    this.game.physics.arcade.overlap(this.bullets, this.player, this.onBulletHit, null, this);
};

WADEnemy4.prototype.onBulletHit = function(player, bullet) {
    bullet.kill();
    player.hit(this.facing);
    player.damage(1);
};

WADEnemy4.prototype.damage = function(amount) {
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
            this.game.sound._sounds[2].play();
            // this.game.plugins.cameraShake.shake();

            this.game.camera.unfollow();
            this.game.camera.bounds = null;
            this.shakeStep = 0;
            this.shakeCount = 20;
            var position = this.game.camera.position;
            if(this.shake_timer == undefined)
            {
                this.shake_timer = this.game.time.create(false);
                this.shake_timer.loop(50, function(){
                    if(this.shakeCount <= 0)
                    {
                        this.game.camera.bounds = new Phaser.Rectangle(0, 0, 1920, 1080)
                        this.game.camera.x = 0;
                        this.game.camera.y = 0;
                        this.game.camera.follow(this.game.player);
                        this.shake_timer.stop();
                        this.shake_timer = null;
                        return;
                    }

                    switch(this.shakeStep)
                    {
                        case 0 :
                            // up right
                            this.game.camera.focusOnXY(position.x+10,position.y+10);
                            this.shakeStep = 1;
                            break;
                        case 1 :
                            // center down
                            this.game.camera.focusOnXY(position.x,position.y+5);
                            this.shakeStep = 2;
                            break;
                        case 2 :
                            // up left
                            this.game.camera.focusOnXY(position.x-10,position.y+10);
                            this.shakeStep = 3;
                            break;
                        case 3 :
                            this.game.camera.focusOnXY(position.x,position.y);
                            this.shakeStep = 0;
                            break;
                    }

                    this.shakeCount--;

                }, this);
                this.shake_timer.start();
            }
        }
    }
    return this;
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

WADEnemy4.prototype.moveLeft = function(){
    this.body.velocity.x = -ENEMY_MOVE_VELOCITY;
    if(!this.facing == "left") {
        this.scale.x = - 1;
        this.animations.play(this.leftAnimation);
        this.facing = "left";
    }
};

WADEnemy4.prototype.moveRight = function(){
    this.body.velocity.x = -ENEMY_MOVE_VELOCITY;
    if(!this.facing == "right"){
        this.scale.x = 1;
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
            bullet.anchor.setTo(0.5, 0.9);
            bullet.reset(this.x + this.width, this.y + (this.height / 2));
            bullet.body.velocity.x = side * this.bullet_velocity;

            this.isReadyToFire = false;
            this.lastShot = this.game.time.now;
            this.game.sound._sounds[2].play();
            this.animations.play('shoot', 10);
        }
    }

    // Fire cooldown checker
    if(this.game.time.now > this.lastShot + this.firerate) {
        this.isReadyToFire = true;
    }
};
