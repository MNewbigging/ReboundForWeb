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
        // IEntity fields default values
        this.posX = 0;
        this.posY = 0;
        this.color = "black";
        this.lineWidth = 2;
        this.moveSpeed = 2;
        // ICircleEntity fields default values
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
        // Check if moving diagonally, cap speed
        var speed = (this.dirX != 0 && this.dirY != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        this.posX += (this.dirX * speed);
        this.posY += (this.dirY * speed);
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
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    function Bullet(px, py, dx, dy) {
        var _this = _super.call(this, px, py, dx, dy, "red", 1, 20, 5) || this;
        _this.active = false;
        return _this;
    }
    Bullet.prototype.update = function () {
        // Delete bullet if outside of canvas
        _super.prototype.update.call(this);
    };
    return Bullet;
}(CircleMovingEntity));
var CanvasUtils = /** @class */ (function () {
    function CanvasUtils() {
        this.setupCanvas();
    }
    CanvasUtils.getInstance = function () {
        if (!this.instance) {
            CanvasUtils.instance = new CanvasUtils();
        }
        return CanvasUtils.instance;
    };
    CanvasUtils.prototype.getCanvas = function () {
        return this.canvas;
    };
    CanvasUtils.prototype.getCanvasContext = function () {
        return this.canvasContext;
    };
    CanvasUtils.prototype.setupCanvas = function () {
        // Get reference to canvas element
        var cvs = document.getElementById("game-canvas");
        if (cvs instanceof HTMLCanvasElement) {
            this.canvas = cvs;
        }
        // Get ref to canvas context
        var ctx = this.canvas.getContext("2d");
        if (ctx instanceof CanvasRenderingContext2D) {
            this.canvasContext = ctx;
        }
        // Resize canvas based on current window dimensions
        var canvasWrapper = document.getElementById("game-container");
        if (this.canvas && canvasWrapper) {
            var wrapperBounds = canvasWrapper.getBoundingClientRect();
            this.canvas.width = wrapperBounds.width;
            this.canvas.height = wrapperBounds.height;
            console.log("canvas w: " + this.canvas.width);
        }
    };
    CanvasUtils.prototype.clearCanvas = function () {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    return CanvasUtils;
}());
/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 50, 50, 0, 0, "green", 2, 3, 10) || this;
        _this.lastDirX = 0;
        _this.lastDirY = -1;
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
        _this.fireShot = function () {
            _this.bullets.push(new Bullet(_this.posX, _this.posY, _this.lastDirX, _this.lastDirY));
        };
        _this.bullets = [];
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
    Player.prototype.update = function () {
        _super.prototype.update.call(this);
        // If there is a direction to save
        if (this.dirX != 0 || this.dirY != 0) {
            // Save current direction for bullets next frame
            this.lastDirX = this.dirX;
            this.lastDirY = this.dirY;
        }
        // Clear current dir to stop player moving into next frame
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
    };
    return KeyboardInput;
}());
/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />
/// <reference path= "canvasUtils.ts" />
var GameState = /** @class */ (function () {
    function GameState() {
        var _this = this;
        // Main game logic loop
        this.gameLoop = function () {
            // Clear the canvas
            _this.canvasUtils.clearCanvas();
            // Player input 
            _this.keyInput.inputLoop();
            // Update
            _this.updateAll();
            // Render
            _this.renderAll();
            // Repeat this function to loop
            requestAnimationFrame(_this.gameLoop);
        };
        this.canvasUtils = CanvasUtils.getInstance();
        this.keyInput = new KeyboardInput();
        this.player = new Player();
        this.defineInputActions();
    }
    GameState.prototype.defineInputActions = function () {
        // Add movement functions as callbacks
        // Left arrow / a
        this.keyInput.addKeycodeCallback(37, this.player.moveLeft);
        this.keyInput.addKeycodeCallback(65, this.player.moveLeft);
        // Right arrow / d
        this.keyInput.addKeycodeCallback(39, this.player.moveRight.bind(this.player, this.canvasUtils.getCanvas().width));
        this.keyInput.addKeycodeCallback(68, this.player.moveRight.bind(this.player, this.canvasUtils.getCanvas().width));
        // Up arrow / w
        this.keyInput.addKeycodeCallback(38, this.player.moveUp);
        this.keyInput.addKeycodeCallback(87, this.player.moveUp);
        // down arrow / s
        this.keyInput.addKeycodeCallback(40, this.player.moveDown.bind(this.player, this.canvasUtils.getCanvas().height));
        this.keyInput.addKeycodeCallback(83, this.player.moveDown.bind(this.player, this.canvasUtils.getCanvas().height));
        // Fire
        this.keyInput.addKeycodeCallback(32, this.player.fireShot);
    };
    GameState.prototype.updateAll = function () {
        // Update player
        this.player.update();
        // Update player bullets
        if (this.player.bullets.length > 0) {
            for (var _i = 0, _a = this.player.bullets; _i < _a.length; _i++) {
                var bullet = _a[_i];
                bullet.update();
            }
        }
    };
    GameState.prototype.renderAll = function () {
        // Render player
        this.player.draw(this.canvasUtils.getCanvasContext());
        // Render player bullets
        if (this.player.bullets.length > 0) {
            for (var _i = 0, _a = this.player.bullets; _i < _a.length; _i++) {
                var bullet = _a[_i];
                bullet.draw(this.canvasUtils.getCanvasContext());
            }
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