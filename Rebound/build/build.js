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
        this.direction = {
            dirX: 0,
            dirY: 0
        };
        this.moveLeft = function () {
            // Ensure player doesn't leave canvas
            if (_this.shape.x > _this.moveSpeed + _this.shape.radius) {
                _this.direction.dirX = -1;
                _this.move();
            }
        };
        this.moveUp = function () {
            if (_this.shape.y > _this.moveSpeed + _this.shape.radius) {
                _this.direction.dirY = -1;
                _this.move();
            }
        };
        this.shape = new Circle(100, 100, 10, "green");
        this.moveSpeed = 3;
    }
    Player.prototype.moveRight = function (canvasWidth) {
        console.log("player cw: " + canvasWidth);
        if (this.shape.x < canvasWidth - this.moveSpeed - this.shape.radius) {
            this.direction.dirX = 1;
            this.move();
        }
    };
    Player.prototype.moveDown = function (canvasHeight) {
        if (this.shape.y < canvasHeight - this.moveSpeed - this.shape.radius) {
            this.direction.dirY = 1;
            this.move();
        }
    };
    Player.prototype.move = function () {
        // Check if moving diagonally, cap speed
        var speed = (this.direction.dirX != 0 && this.direction.dirY != 0) ? this.moveSpeed * 0.5 : this.moveSpeed;
        this.shape.x += (this.direction.dirX * this.moveSpeed);
        this.shape.y += (this.direction.dirY * this.moveSpeed);
        this.direction.dirX = 0;
        this.direction.dirY = 0;
    };
    return Player;
}());
var KeyboardInput = /** @class */ (function () {
    function KeyboardInput() {
        var _this = this;
        // Map key code number to callback function
        this.keyCallback = {};
        // Map that tracks which keys are currently pressed
        this.keyDown = {};
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
    KeyboardInput.prototype.addKeycodeCallback = function (keycode, action) {
        this.keyCallback[keycode] = action;
        this.keyDown[keycode] = false; // need this?
    };
    return KeyboardInput;
}());
/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />
var GameState = /** @class */ (function () {
    function GameState(cnvs) {
        var _this = this;
        // Main game logic loop
        this.gameLoop = function () {
            // Clear the canvas
            _this.canvasContext.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            // Player input 
            _this.keyInput.inputLoop();
            // Render
            // Player
            _this.player.shape.draw(_this.canvasContext);
        };
        this.canvas = cnvs;
        var ctx = this.canvas.getContext("2d");
        if (ctx instanceof CanvasRenderingContext2D) {
            this.canvasContext = ctx;
        }
        else {
            // Couldn't get canvas context; can't draw, stop here
            console.log("ERROR: can't get canvas context");
        }
        this.player = new Player();
        this.keyInput = new KeyboardInput();
        // Add movement functions as callbacks
        // Left arrow / a
        this.keyInput.addKeycodeCallback(37, this.player.moveLeft);
        this.keyInput.addKeycodeCallback(65, this.player.moveLeft);
        // Right arrow / d
        this.keyInput.addKeycodeCallback(39, this.player.moveRight.bind(this.player, this.canvas.width));
        this.keyInput.addKeycodeCallback(68, this.player.moveRight.bind(this.player, this.canvas.width));
        // Up arrow / w
        this.keyInput.addKeycodeCallback(38, this.player.moveUp);
        this.keyInput.addKeycodeCallback(87, this.player.moveUp);
        // down arrow / s
        this.keyInput.addKeycodeCallback(40, this.player.moveDown.bind(this.player, this.canvas.height));
        this.keyInput.addKeycodeCallback(83, this.player.moveDown.bind(this.player, this.canvas.height));
    }
    GameState.prototype.resize = function () {
        var canvasWrapper = document.getElementById("game-container");
        if (this.canvas && canvasWrapper) {
            var wrapperBounds = canvasWrapper.getBoundingClientRect();
            this.canvas.width = wrapperBounds.width;
            this.canvas.height = wrapperBounds.height;
            console.log("canvas w: " + this.canvas.width);
        }
    };
    return GameState;
}());
/// <reference path="gamestate.ts" />
var gameState;
window.onload = function () {
    var canvas = document.getElementById("game-canvas");
    var canvasWrapper = document.getElementById("game-container");
    if (canvas && canvasWrapper) {
        var wrapperBounds = canvasWrapper.getBoundingClientRect();
        canvas.width = wrapperBounds.width;
        canvas.height = wrapperBounds.height;
        gameState = new GameState(canvas);
        setInterval(gameState.gameLoop, 10);
    }
    else {
        console.log("ERROR: couldn't find canvas element");
    }
};
window.onresize = function () {
    this.gameState.resize();
};
//# sourceMappingURL=build.js.map