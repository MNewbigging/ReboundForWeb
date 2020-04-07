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
var Point = /** @class */ (function () {
    function Point(xVal, yVal) {
        if (xVal === void 0) { xVal = 0; }
        if (yVal === void 0) { yVal = 0; }
        this.x = 0;
        this.y = 0;
        this.x = xVal;
        this.y = yVal;
    }
    Point.Subtract = function (left, right) {
        return new Point(left.x - right.x, left.y - right.y);
    };
    Point.Length = function (point) {
        return Math.sqrt((point.x * point.x) + (point.y * point.y));
    };
    Point.Normalize = function (point) {
        var length = this.Length(point);
        return new Point(point.x / length, point.y / length);
    };
    Point.Print = function (point, pre) {
        if (!pre) {
            pre = "";
        }
        console.log(pre + " (" + point.x + ", " + point.y + ")");
    };
    return Point;
}());
/// <reference path="utils.ts" />
var CanvasUtils = /** @class */ (function () {
    function CanvasUtils() {
        var _this = this;
        this.mouseOffsetLeft = 0;
        this.mouseOffsetTop = 0;
        this.mousePos = new Point();
        this.getMouseCanvasPos = function (event) {
            // coords from event minus canvas margins on page
            _this.mousePos.x = event.clientX - _this.mouseOffsetLeft;
            _this.mousePos.y = event.clientY - _this.mouseOffsetTop;
            // scale mouse coords to match canvas coords
            var canvasBounds = _this.canvas.getBoundingClientRect();
            _this.mousePos.x /= canvasBounds.width;
            _this.mousePos.y /= canvasBounds.height;
            _this.mousePos.x *= _this.canvas.width;
            _this.mousePos.y *= _this.canvas.height;
        };
        this.setupCanvas();
        document.addEventListener('mousemove', this.getMouseCanvasPos);
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
    CanvasUtils.prototype.getMousePos = function () {
        return this.mousePos;
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
            //this.canvasContext.translate(this.canvas.width / 2, this.canvas.height / 2);
            var canvasBounds = this.canvas.getBoundingClientRect();
            this.mouseOffsetLeft = canvasBounds.left;
            this.mouseOffsetTop = canvasBounds.top;
        }
    };
    CanvasUtils.prototype.clearCanvas = function () {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
    CanvasUtils.prototype.outOfBoundsLeftOrTop = function (pos, moveSpeed, radius) {
        var step = moveSpeed + radius;
        if (pos < step) {
            return true;
        }
        return false;
    };
    CanvasUtils.prototype.outOfBoundsRight = function (posX, moveSpeed, radius) {
        var step = moveSpeed + radius;
        if (posX > this.canvas.width - step) {
            return true;
        }
        return false;
    };
    CanvasUtils.prototype.outOfBoundsBottom = function (posY, moveSpeed, radius) {
        var step = moveSpeed + radius;
        if (posY > this.canvas.height - step) {
            return true;
        }
        return false;
    };
    return CanvasUtils;
}());
/// <reference path= "canvasUtils.ts" />
/// <reference path="utils.ts" />
var CircleMovingEntity = /** @class */ (function () {
    function CircleMovingEntity(px, py, dx, dy, col, lw, speed, r) {
        // IEntity fields default values
        this.pos = new Point();
        this.color = "black";
        this.lineWidth = 2;
        // IMovingEntity fields default values
        this.dir = new Point();
        this.moveSpeed = 2;
        // ICircleEntity fields default values
        this.radius = 10;
        this.pos.x = px;
        this.pos.y = py;
        this.dir.x = dx;
        this.dir.y = dy;
        this.color = col;
        this.lineWidth = lw;
        this.moveSpeed = speed;
        this.radius = r;
        this.canvasUtils = CanvasUtils.getInstance();
    }
    CircleMovingEntity.prototype.update = function () {
        // Check if moving diagonally, cap speed
        var speed = (this.dir.x != 0 && this.dir.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        this.pos.x += (this.dir.x * speed);
        this.pos.y += (this.dir.y * speed);
    };
    CircleMovingEntity.prototype.draw = function () {
        var canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
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
    /*
    +1 to this every rebound; damage can be multiplied rather than if(active) each frame!
    public damageMultiplier: number = 0;
    */
    function Bullet(px, py, dx, dy) {
        var _this = _super.call(this, px, py, dx, dy, "red", 1, 20, 5) || this;
        _this.alive = true; // does this bullet exist
        return _this;
    }
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        if (this.canvasUtils.outOfBoundsLeftOrTop(this.pos.x, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsLeftOrTop(this.pos.y, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsRight(this.pos.x, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsBottom(this.pos.y, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
    };
    return Bullet;
}(CircleMovingEntity));
/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, 20, 20, 0, 0, "green", 2, 3, 10) || this;
        _this.lastDir = new Point(0, -1);
        _this.moveLeft = function () {
            if (!_this.canvasUtils.outOfBoundsLeftOrTop(_this.pos.x, _this.moveSpeed, _this.radius)) {
                _this.dir.x = -1;
            }
        };
        _this.moveRight = function () {
            if (!_this.canvasUtils.outOfBoundsRight(_this.pos.x, _this.moveSpeed, _this.radius)) {
                _this.dir.x = 1;
            }
        };
        _this.moveUp = function () {
            if (!_this.canvasUtils.outOfBoundsLeftOrTop(_this.pos.y, _this.moveSpeed, _this.radius)) {
                _this.dir.y = -1;
            }
        };
        _this.moveDown = function () {
            if (!_this.canvasUtils.outOfBoundsBottom(_this.pos.y, _this.moveSpeed, _this.radius)) {
                _this.dir.y = 1;
            }
        };
        _this.fireShot = function () {
            Point.Print(_this.canvasUtils.getMousePos(), "mouse pos:");
            Point.Print(_this.pos, "player pos:");
            var playerToMouse = Point.Subtract(_this.canvasUtils.getMousePos(), _this.pos);
            Point.Print(playerToMouse, "player to mouse");
            var normDir = Point.Normalize(playerToMouse);
            Point.Print(normDir, "normalised:");
            _this.bullets.push(new Bullet(_this.pos.x, _this.pos.y, normDir.x, normDir.y));
        };
        _this.canvasUtils = CanvasUtils.getInstance();
        _this.bullets = [];
        return _this;
    }
    Player.prototype.update = function () {
        _super.prototype.update.call(this);
        // If there is a direction to save
        if (this.dir.x != 0 || this.dir.y != 0) {
            // Save current direction for bullets next frame
            this.lastDir.x = this.dir.x;
            this.lastDir.y = this.dir.y;
        }
        // Clear current dir to stop player moving into next frame
        this.dir.x = 0;
        this.dir.y = 0;
        // Remove any dead bullets (outside of canvas)
        for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].alive) {
                this.bullets.splice(i, 1);
            }
        }
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
        this.keyInput.addKeycodeCallback(39, this.player.moveRight);
        this.keyInput.addKeycodeCallback(68, this.player.moveRight);
        // Up arrow / w
        this.keyInput.addKeycodeCallback(38, this.player.moveUp);
        this.keyInput.addKeycodeCallback(87, this.player.moveUp);
        // down arrow / s
        this.keyInput.addKeycodeCallback(40, this.player.moveDown);
        this.keyInput.addKeycodeCallback(83, this.player.moveDown);
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
        this.player.draw();
        // Render player bullets
        if (this.player.bullets.length > 0) {
            for (var _i = 0, _a = this.player.bullets; _i < _a.length; _i++) {
                var bullet = _a[_i];
                bullet.draw();
            }
        }
    };
    return GameState;
}());
/// <reference path="gamestate.ts" />
var gameState;
window.onload = function () {
    gameState = new GameState();
    requestAnimationFrame(gameState.gameLoop);
};
//# sourceMappingURL=build.js.map