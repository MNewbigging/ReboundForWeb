/// <reference path="gamestate.ts" />

var gameState: GameState;

window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    if (canvas) {
        gameState = new GameState(canvas)
        setInterval(gameState.gameLoop, 10);
    }
 
}