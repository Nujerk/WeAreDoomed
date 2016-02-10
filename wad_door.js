/**
 * WAD door class
 */
WADDoor = function (game, x, y) {

    Phaser.Sprite.call(this, game, x, y, 'teleporter');
    this.animations.add('teleporter_appear',[1,2,3,4]);
    this.animations.add('teleporter_idle',[4,5]);

    this.game = game;
    this.enemies = null;
    this.open = false;

};

WADDoor.prototype = Object.create(Phaser.Sprite.prototype);
WADDoor.prototype.constructor = WADDoor;

/**
 * Automatically called by World.update
 */
WADDoor.prototype.update = function() {
    if(this.open == true)
        this.animations.play('teleporter_idle', 10, true);

    if(!this.open)
        this.visible = false;

    var enemy = this.enemies.getFirstAlive();
    if(!enemy && !this.open) {
        this.open = true;
        this.visible = true;
        this.animations.play('teleporter_appear', 10);
    }
};

WADDoor.prototype.setEnemies = function(enemies) {
    this.enemies = enemies;
};