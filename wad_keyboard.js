var leftBtn;
var rightBtn;
var speed = 4;

function create() {
    game.input.keyboard.onDownCallback = onDown;
    game.input.keyboard.onUpCallback = onUp;
}

function onDown(event) {

    if (event.KeyCode === Phaser.KeyCode.SPACEBAR)
    {
        /// JUMP
    }
    else if (event.KeyCode === Phaser.KeyCode.A)
    {
        /// SPECIAL ATTACK
    }
    else if (event.KeyCode === Phaser.KeyCode.CONTROL)
    {
        /// FIRE;
    }
    else if (event.KeyCode === Phaser.KeyCode.Q)
    {
        /// Move Left
    }
    else if (event.KeyCode === Phaser.KeyCode.D)
    {
        /// Move Right
    }
    else if (event.KeyCode === Phaser.KeyCode.Z)
    {
        /// AIM UP
    }
    else if (event.KeyCode === Phaser.KeyCode.S)
    {
        /// Pick Up Weapon
    }
    else if (event.KeyCode === Phaser.KeyCode.SHIFT)
    {
        /// Lock Position
    }
    else if (event.KeyCode === Phaser.KeyCode.ENTER)
    {
        /// Roll
    }
}

function onUp(event) {

    if (event.KeyCode === Phaser.KeyCode.CONTROL)
    {
        /// STOP AUTO FIRE;
    }
    else if (event.KeyCode === Phaser.KeyCode.Q)
    {
        /// STOP
    }
    else if (event.KeyCode === Phaser.KeyCode.D)
    {
        /// STOP
    }
    else if (event.KeyCode === Phaser.KeyCode.Z)
    {
        /// AIM NORMAL
    }
    else if (event.KeyCode === Phaser.KeyCode.SHIFT)
    {
        /// Unlock Position
    }
    
}