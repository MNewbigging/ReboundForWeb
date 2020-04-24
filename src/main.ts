/// <reference path="gamestate.ts" />
/// <reference path="./Menu/screenSystem.ts" />

var menuSystem: ScreenSystem;

window.onload = () => {
    // Create the game
    menuSystem = new ScreenSystem();    
    // Kick off the main loop
    requestAnimationFrame(menuSystem.systemLoop);
}


