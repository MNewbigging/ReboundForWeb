/// <reference path="gamestate.ts" />

var gameState: GameState;

window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    var canvasWrapper = document.getElementById("game-container");
    if (canvas && canvasWrapper) {
        let wrapperBounds = canvasWrapper.getBoundingClientRect();
        canvas.width = wrapperBounds.width;
        canvas.height = wrapperBounds.height;

        gameState = new GameState(canvas);
        setInterval(gameState.gameLoop, 10);
    }
    else {
        console.log("ERROR: couldn't find canvas element");
    }
}

window.onresize = function() {
    this.gameState.resize();
}