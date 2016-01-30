/**
 * WAD Weapons
 */

/// GATLING
WADWeaponGatling = function (game) {
	this.bullets = game.add.group()
    this.game = game;
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet');
    this.bullets.forEach(function(bullet){
        bullet.checkWorldBounds = true;
        bullet.outOfBoundsKill = true;
    }, this);

    this.isReadyToFire = true;
    this.lastShot = 0;
    this.firerate = 100;
    this.bullet_velocity = 500;

    this.overheating = 0;
    this.cantShoot = false;
    var style = { font: "bold 24px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
    //  The Text is positioned at 0, 100
    this.text = this.game.add.text(15, 35, this.overheating + "°C" , style);
    this.text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

    //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
    this.text.fixedToCamera = true;
    this.text.cameraOffset.setTo(15, 35);

    //  Create our Timer
    this.overheatingTimer = this.game.time.create(false);

    var l_TimerFunction = function()
    {
        if(this.overheating > 0 && (this.game.time.now - this.lastShot) > 500 )
        {
            this.overheating -= 1; 
        }

        if(this.overheating < 0)
            this.overheating = 0;
    };
    
    //  Set a TimerEvent to occur after 2 seconds
    this.overheatingTimer.loop(1000, l_TimerFunction, this);

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    this.overheatingTimer.start();
};

WADWeaponGatling.prototype.constructor = WADWeaponGatling;
WADWeaponGatling.prototype.shoot = function(player){
	if(this.isReadyToFire && !this.cantShoot) {
        if(this.bullets.getFirstExists(false)) {
            var bullet = this.bullets.getFirstExists(false);
            bullet.anchor.setTo(0.5, 0.5);
            bullet.reset(player.x, player.y + (player.height / 2));
            var side = 1;
            if(player.facing == "left")
            	side = -1;
            bullet.body.velocity.x = side * this.bullet_velocity;

            this.isReadyToFire = false;
            this.lastShot = player.game.time.now;
            this.overheating+= 2;
        }
    }

    if(this.overheating >= 100)
        this.cantShoot = true;

    // Fire cooldown checker
    if(this.game.time.now > this.lastShot + this.firerate) {
        this.isReadyToFire = true;
    }
};

WADWeaponGatling.prototype.special = function(player){
    if(!this.cantShoot)
        return;

    this.cantShoot = false;
    this.overheating = 0;
};

WADWeaponGatling.prototype.update = function(){

    this.text.text = this.overheating + "°C";

    if(this.cantShoot)
    {

        if(this.overheating <= 50)
        {
            this.cantShoot = false;    
        }
        else
        {
            this.text.text += " OVERHEATING !!!";
        }
    }
};


/// BOW
WADWeaponBow = function (game) {
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
    this.firerate = 100;
    this.bullet_velocity = 500;
};

WADWeaponBow.prototype.constructor = WADWeaponBow;
WADWeaponBow.prototype.shoot = function(player){
	if(this.isReadyToFire) {
        if(this.bullets.getFirstExists(false)) {
            var bullet = this.bullets.getFirstExists(false);
            bullet.anchor.setTo(0.5, 0.5);
            bullet.reset(this.x, this.y + (this.height / 2));
            var side = 1;

            if(player.facing == "left")
            	side = -1;
            bullet.body.velocity.x = side * this.bullet_velocity;

            this.isReadyToFire = false;
            this.lastShot = player.game.time.now;
        }
    }

    // Fire cooldown checker
    if(player.game.time.now > this.lastShot + this.firerate) {
        this.isReadyToFire = true;
    }
};

WADWeaponBow.prototype.special = function(player){

};

WADWeaponBow.prototype.update = function()
{

};

/// SHOTGUN
WADWeaponShotgun = function (game) {
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
    this.firerate = 100;
    this.bullet_velocity = 500;
};

WADWeaponShotgun.prototype.constructor = WADWeaponShotgun;
WADWeaponShotgun.prototype.shoot = function(player){
	if(this.isReadyToFire) {
        if(this.bullets.getFirstExists(false)) {
            var bullet = this.bullets.getFirstExists(false);
            bullet.anchor.setTo(0.5, 0.5);
            bullet.reset(this.x, this.y + (this.height / 2));
            var side = 1;

            if(player.facing == "left")
            	side = -1;
            bullet.body.velocity.x = side * this.bullet_velocity;

            this.isReadyToFire = false;
            this.lastShot = player.game.time.now;
        }
    }

    // Fire cooldown checker
    if(player.game.time.now > this.lastShot + this.firerate) {
        this.isReadyToFire = true;
    }
};

WADWeaponShotgun.prototype.special = function(player){

};

WADWeaponShotgun.prototype.update = function()
{

};