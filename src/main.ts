/// <reference path="gamestate.ts" />

var gameState: GameState;

window.onload = () => {
    gameState = new GameState();

    requestAnimationFrame(gameState.gameLoop);
}

