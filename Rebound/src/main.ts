/// <reference path="gameLogic.ts" />


var gameState: Gamestate;
(function(){
    console.log("test");
})

window.onload = () => {
    var test = document.getElementById("log");

    var canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
    let context = canvas.getContext("2d");
    if (context instanceof CanvasRenderingContext2D) {
        gameState = new Gamestate(context, 800, 600)
        setInterval(gameState.gameLoop, 10);
    }
 
}