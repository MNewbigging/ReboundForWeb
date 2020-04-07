"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var CircleMovingEntity = /** @class */ (function () {
    function CircleMovingEntity(px, py, dx, dy, col, lw, speed, r) {
        // IEntity fields
        this.posX = 0;
        this.posY = 0;
        this.color = "black";
        this.lineWidth = 2;
        // IMovingEntity fields
        this.dirX = 0;
        this.dirY = 0;
        this.moveSpeed = 1;
        // ICircleEntity fields
        this.radius = 10;
        this.posX = px;
        this.posY = py;
        this.dirX = dx;
        this.dirY = dy;
        this.color = col;
        this.lineWidth = lw;
        this.moveSpeed = speed;
        this.radius = r;
    }
    CircleMovingEntity.prototype.update = function () {
    };
    CircleMovingEntity.prototype.draw = function (canvasContext) {
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    };
    return CircleMovingEntity;
}());
/// <reference path="entities.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 50, 50, 0, 0, "green", 2, 3, 10) || this;
        _this.moveLeft = function () {
            // Ensure player doesn't leave canvas
            if (_this.posX > _this.moveSpeed + _this.radius) {
                _this.dirX = -1;
            }
        };
        _this.moveUp = function () {
            if (_this.posY > _this.moveSpeed + _this.radius) {
                _this.dirY = -1;
            }
        };
        return _this;
    }
    Player.prototype.moveRight = function (canvasWidth) {
        if (this.posX < canvasWidth - this.moveSpeed - this.radius) {
            this.dirX = 1;
        }
    };
    Player.prototype.moveDown = function (canvasHeight) {
        if (this.posY < canvasHeight - this.moveSpeed - this.radius) {
            this.dirY = 1;
        }
    };
    Player.prototype.fireShot = function () {
        console.log("Pew pew");
    };
    Player.prototype.update = function () {
        // Check if moving diagonally, cap speed
        var speed = (this.dirX != 0 && this.dirY != 0) ? this.moveSpeed * 0.5 : this.moveSpeed;
        this.posX += (this.dirX * this.moveSpeed);
        this.posY += (this.dirY * this.moveSpeed);
        this.dirX = 0;
        this.dirY = 0;
    };
    return Player;
}(CircleMovingEntity));
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
                // If pressed
                if (_this.keyDown[key]) {
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
    function GameState() {
        var _this = this;
        // Main game logic loop
        this.gameLoop = function () {
            // Clear the canvas
            _this.canvasContext.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            // Player input 
            _this.keyInput.inputLoop();
            // Update
            _this.player.update();
            // Render
            _this.player.draw(_this.canvasContext);
            // Repeat this function to loop
            requestAnimationFrame(_this.gameLoop);
        };
        var cvs = document.getElementById("game-canvas");
        if (cvs instanceof HTMLCanvasElement) {
            this.canvas = cvs;
        }
        var ctx = this.canvas.getContext("2d");
        if (ctx instanceof CanvasRenderingContext2D) {
            this.canvasContext = ctx;
        }
        this.resize();
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
        // Fire
        this.keyInput.addKeycodeCallback(32, this.player.fireShot);
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
    gameState = new GameState();
    //setInterval(gameState.gameLoop, 10);
    requestAnimationFrame(gameState.gameLoop);
};
//# sourceMappingURL=build.js.map