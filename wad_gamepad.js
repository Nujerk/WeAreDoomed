var pad;

var buttonA;
var buttonB;
var buttonX;
var buttonY;
var buttonDPadLeft;
var buttonDPadRight;
var buttonDPadUp;
var buttonDPadDown;

function create() {

    game.input.gamepad.start();

    pad = game.input.gamepad.pad1;

    pad.addCallbacks(this, { onConnect: addButtons });
}

function addButtons() {

    //  We can't do this until we know that the gamepad has been connected and is started
    buttonA = pad.getButton(Phaser.Gamepad.XBOX360_A);
    buttonB = pad.getButton(Phaser.Gamepad.XBOX360_B);
    buttonX = pad.getButton(Phaser.Gamepad.XBOX360_X);
    buttonY = pad.getButton(Phaser.Gamepad.XBOX360_Y);

    buttonA.onDown.add(onDown, this);
    buttonB.onDown.add(onDown, this);
    buttonX.onDown.add(onDown, this);
    buttonY.onDown.add(onDown, this);

    buttonA.onUp.add(onUp, this);
    buttonB.onUp.add(onUp, this);
    buttonX.onUp.add(onUp, this);
    buttonY.onUp.add(onUp, this);

    //  These won't work in Firefox, sorry! It uses totally different button mappings

    buttonDPadLeft = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_LEFT);
    buttonDPadRight = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
    buttonDPadUp = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_UP);
    buttonDPadDown = pad.getButton(Phaser.Gamepad.XBOX360_DPAD_DOWN);

    buttonDPadLeft.onDown.add(onDown, this);
    buttonDPadRight.onDown.add(onDown, this);
    buttonDPadUp.onDown.add(onDown, this);
    buttonDPadDown.onDown.add(onDown, this);

    buttonDPadLeft.onUp.add(onUp, this);
    buttonDPadRight.onUp.add(onUp, this);
    buttonDPadUp.onUp.add(onUp, this);
    buttonDPadDown.onUp.add(onUp, this);

}

function onDown(button, value) {

    if (button.buttonCode === Phaser.Gamepad.XBOX360_A)
    {
        /// JUMP
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_B)
    {
        /// SPECIAL ATTACK
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
    {
        /// FIRE;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
    {
        /// Move Left
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
    {
        /// Move Right
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
    {
        /// AIM UP
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_DOWN)
    {
        /// Pick Up Weapon
    }
    else if (button.buttonCode == Phaser.Gamepad.XBOX360_LEFT_TRIGGER)
    {
        /// Lock Position
    }
    else if (button.buttonCode == Phaser.Gamepad.XBOX360_RIGHT_TRIGGER)
    {
        /// Roll
    }
}

function onUp(button, value) {

    if (button.buttonCode === Phaser.Gamepad.XBOX360_X)
    {
        /// STOP AUTO FIRE;
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_LEFT)
    {
        /// STOP
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_RIGHT)
    {
        /// STOP
    }
    else if (button.buttonCode === Phaser.Gamepad.XBOX360_DPAD_UP)
    {
        /// AIM NORMAL
    }
    else if (button.buttonCode == Phaser.Gamepad.XBOX360_LEFT_TRIGGER)
    {
        /// Unlock Position
    }
    
}