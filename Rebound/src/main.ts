/// <reference path="gamestate.ts" />


window.onresize = function() {
    var canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    var canvasWrapper = document.getElementById("game-container");
    if (canvas && canvasWrapper) {
        let wrapperBounds = canvasWrapper.getBoundingClientRect();
        canvas.width = wrapperBounds.width;
        canvas.height = wrapperBounds.height;
    }
}



window.onload = () => {
    var canvas = <HTMLCanvasElement>document.getElementById("game-canvas");
    var canvasWrapper = document.getElementById("game-container");
    if (canvas && canvasWrapper) {
        let wrapperBounds = canvasWrapper.getBoundingClientRect();
        canvas.width = wrapperBounds.width;
        canvas.height = wrapperBounds.height;

        var gameState = new GameState(canvas);
        setInterval(gameState.gameLoop, 10);
    }
    else {
        console.log("ERROR: couldn't find canvas element");
    }
 
}