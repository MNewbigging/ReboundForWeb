/// <reference path="gamestate.ts" />

var gameState: GameState;

window.onload = () => {
    gameState = new GameState();
    //setInterval(gameState.gameLoop, 10);
    requestAnimationFrame(gameState.gameLoop);
}

