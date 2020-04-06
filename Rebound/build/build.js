"use strict";
var Circle = /** @class */ (function () {
    function Circle(x, y, radius, color, lineWidth) {
        var _this = this;
        if (color === void 0) { color = "red"; }
        if (lineWidth === void 0) { lineWidth = 2; }
        this.x = 0;
        this.y = 0;
        this.radius = 10;
        this.lineWidth = 2;
        this.color = "red";
        this.draw = function (canvasContext) {
            canvasContext.save();
            canvasContext.beginPath();
            canvasContext.arc(_this.x, _this.y, _this.radius, 0, 2 * Math.PI);
            canvasContext.strokeStyle = _this.color;
            canvasContext.stroke();
            canvasContext.fillStyle = _this.color;
            canvasContext.fill();
            canvasContext.lineWidth = _this.lineWidth;
            canvasContext.restore();
        };
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lineWidth = lineWidth;
    }
    return Circle;
}());
/// <reference path="shapes.ts" />
var Player = /** @class */ (function () {
    function Player() {
        var _this = this;
        this.moveLeft = function () {
            // Ensure player doesn't leave canvas
            if (_this.shape.x > _this.moveSpeed + _this.shape.radius) {
                _this.shape.x -= _this.moveSpeed;
            }
        };
        this.moveRight = function () {
            if (_this.shape.x < 600 - _this.moveSpeed - _this.shape.radius) {
                _this.shape.x += _this.moveSpeed;
            }
        };
        this.moveUp = function () {
            if (_this.shape.y > _this.moveSpeed + _this.shape.radius) {
                _this.shape.y -= _this.moveSpeed;
            }
        };
        this.moveDown = function () {
            if (_this.shape.y < 800 - _this.moveSpeed - _this.shape.radius) {
                _this.shape.y += _this.moveSpeed;
            }
        };
        this.shape = new Circle(100, 100, 10, "green");
        this.moveSpeed = 3;
    }
    return Player;
}());
var KeyboardInput = /** @class */ (function () {
    function KeyboardInput() {
        var _this = this;
        // Dictionary that maps key code number to function
        this.keyCallback = {};
        // Dictionary that tracks which keys are pressed/released
        this.keyDown = {};
        this.addKeycodeCallback = function (keycode, f) {
            _this.keyCallback[keycode] = f;
            _this.keyDown[keycode] = false; // need this?
        };
        this.keyboardDown = function (event) {
            event.preventDefault();
            _this.keyDown[event.keyCode] = true;
        };
        this.keyboardUp = function (event) {
            _this.keyDown[event.keyCode] = false;
        };
        this.inputLoop = function () {
            // Loop through all values in dictionary
            for (var key in _this.keyDown) {
                var is_down = _this.keyDown[key];
                // If pressed
                if (is_down) {
                    // Grab function for that key press
                    var callback = _this.keyCallback[key];
                    if (callback != null) {
                        // Perform that function
                        callback();
                    }
                }
            }
        };
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }
    return KeyboardInput;
}());
/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />
var Gamestate = /** @class */ (function () {
    function Gamestate(cnvCtx, cnvW, cnvH) {
        var _this = this;
        // Main game logic loop
        this.gameLoop = function () {
            // Clear the canvas
            _this.canvasCtx.clearRect(0, 0, _this.canvasW, _this.canvasH);
            // Player input 
            _this.keyInput.inputLoop();
            // Update positions
            // Check for collisions
            // Render
            // Player
            _this.player.shape.draw(_this.canvasCtx);
        };
        this.canvasCtx = cnvCtx;
        this.canvasW = cnvW;
        this.canvasH = cnvH;
        this.player = new Player();
        this.keyInput = new KeyboardInput();
        // Add movement functions as callbacks
        // Left arrow / a
        this.keyInput.addKeycodeCallback(37, this.player.moveLeft);
        this.keyInput.addKeycodeCallback(65, this.player.moveLeft);
        // Right arrow / d
        this.keyInput.addKeycodeCallback(39, this.player.moveRight);
        this.keyInput.addKeycodeCallback(68, this.player.moveRight);
        // Up arrow / w
        this.keyInput.addKeycodeCallback(38, this.player.moveUp);
        this.keyInput.addKeycodeCallback(87, this.player.moveUp);
        // down arrow / s
        this.keyInput.addKeycodeCallback(40, this.player.moveDown);
        this.keyInput.addKeycodeCallback(83, this.player.moveDown);
    }
    return Gamestate;
}());
/// <reference path="gameLogic.ts" />
var gameState;
(function () {
    console.log("test");
});
window.onload = function () {
    var test = document.getElementById("log");
    var canvas = document.getElementById("gameCanvas");
    var context = canvas.getContext("2d");
    if (context instanceof CanvasRenderingContext2D) {
        gameState = new Gamestate(context, 800, 600);
        setInterval(gameState.gameLoop, 10);
    }
};
//# sourceMappingURL=build.js.map