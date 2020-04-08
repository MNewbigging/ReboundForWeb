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
        return Math.sqrt(Point.LengthSq(point));
    };
    Point.LengthSq = function (point) {
        return (point.x * point.x) + (point.y * point.y);
    };
    Point.Normalize = function (point) {
        var length = this.Length(point);
        return new Point(point.x / length, point.y / length);
    };
    Point.Dot = function (p1, p2) {
        return (p1.x * p2.x) + (p1.y * p2.y);
    };
    Point.Reflect = function (p1, p2) {
        // p1 - 2 * Dot(p1, p2) * p2;
        var scalar = 2 * this.Dot(p1, p2);
        var scaledPoint = new Point(p2.x * scalar, p2.y * scalar);
        return new Point(p1.x - scaledPoint.x, p1.y - scaledPoint.y);
    };
    Point.Print = function (point, pre) {
        if (!pre) {
            pre = "";
        }
        console.log(pre + " (" + point.x + ", " + point.y + ")");
    };
    return Point;
}());
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.getTargetDirectionNormal = function (target, position) {
        var positionToTarget = Point.Subtract(target, position);
        return Point.Normalize(positionToTarget);
    };
    Utils.CirclesIntersect = function (c1pos, c1r, c2pos, c2r) {
        var distance = Point.Subtract(c1pos, c2pos);
        var radii = c1r + c2r;
        return Point.LengthSq(distance) < radii * radii;
    };
    return Utils;
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
var CircleEntity = /** @class */ (function () {
    function CircleEntity(p, col, lw, r) {
        this.canvasUtils = CanvasUtils.getInstance();
        this.position = p;
        this.color = col;
        this.lineWidth = lw;
        this.radius = r;
    }
    CircleEntity.prototype.draw = function () {
        var canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    };
    return CircleEntity;
}());
var CircleMovingEntity = /** @class */ (function (_super) {
    __extends(CircleMovingEntity, _super);
    function CircleMovingEntity(p, col, lw, r, dir, speed) {
        var _this = _super.call(this, p, col, lw, r) || this;
        _this.direction = dir;
        _this.moveSpeed = speed;
        return _this;
    }
    CircleMovingEntity.prototype.update = function () {
        // Check if moving diagonally, cap speed
        var speed = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        this.position.x += (this.direction.x * speed);
        this.position.y += (this.direction.y * speed);
    };
    return CircleMovingEntity;
}(CircleEntity));
/// <reference path="entities.ts" />
var Bullet = /** @class */ (function (_super) {
    __extends(Bullet, _super);
    /*
    +1 to this every rebound; damage can be multiplied rather than if(active) each frame!
    public damageMultiplier: number = 0;
    */
    function Bullet(p, dir) {
        var _this = _super.call(this, p, "red", 1, 5, dir, 10) || this;
        _this.alive = true; // does this bullet exist
        return _this;
    }
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        this.checkIfOutOfBounds();
    };
    Bullet.prototype.checkIfOutOfBounds = function () {
        if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.x, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.y, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsRight(this.position.x, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsBottom(this.position.y, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
    };
    return Bullet;
}(CircleMovingEntity));
/// <reference path="entities.ts" />
var CircleBumper = /** @class */ (function (_super) {
    __extends(CircleBumper, _super);
    function CircleBumper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CircleBumper;
}(CircleEntity));
/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Point(20, 20), "green", 2, 10, new Point(), 3) || this;
        _this.lastDir = new Point(0, -1);
        _this.maxBullets = 30;
        _this.timeBetweenShots = 0;
        _this.maxTimeBetweenShots = 30;
        _this.moveLeft = function () {
            if (!_this.canvasUtils.outOfBoundsLeftOrTop(_this.position.x, _this.moveSpeed, _this.radius)) {
                _this.direction.x = -1;
            }
        };
        _this.moveRight = function () {
            if (!_this.canvasUtils.outOfBoundsRight(_this.position.x, _this.moveSpeed, _this.radius)) {
                _this.direction.x = 1;
            }
        };
        _this.moveUp = function () {
            if (!_this.canvasUtils.outOfBoundsLeftOrTop(_this.position.y, _this.moveSpeed, _this.radius)) {
                _this.direction.y = -1;
            }
        };
        _this.moveDown = function () {
            if (!_this.canvasUtils.outOfBoundsBottom(_this.position.y, _this.moveSpeed, _this.radius)) {
                _this.direction.y = 1;
            }
        };
        _this.fireShot = function () {
            // Ensure player hasn't reached max bullet count yet
            if (_this.bullets.length < _this.maxBullets) {
                // and make sure time between shots has run out
                if (_this.timeBetweenShots <= 0) {
                    _this.bullets.push(new Bullet(new Point(_this.position.x, _this.position.y), Utils.getTargetDirectionNormal(_this.canvasUtils.getMousePos(), _this.position)));
                    // Reset bullet timer
                    _this.timeBetweenShots = _this.maxTimeBetweenShots;
                }
            }
        };
        _this.bullets = [];
        return _this;
    }
    Player.prototype.update = function () {
        _super.prototype.update.call(this);
        // Tick down time between shots
        this.timeBetweenShots -= 1;
        // If there is a direction to save
        if (this.direction.x != 0 || this.direction.y != 0) {
            // Save current direction for bullets next frame
            this.lastDir.x = this.direction.x;
            this.lastDir.y = this.direction.y;
        }
        // Clear current dir to stop player moving into next frame
        this.direction.x = 0;
        this.direction.y = 0;
        // Remove any dead bullets (outside of canvas) and update the rest
        for (var i = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].alive) {
                this.bullets.splice(i, 1);
            }
            else {
                this.bullets[i].update();
            }
        }
    };
    return Player;
}(CircleMovingEntity));
/// <reference path="bullet.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="utils.ts" />
/// <reference path="player.ts" />
var CollisionManager = /** @class */ (function () {
    function CollisionManager() {
    }
    CollisionManager.prototype.checkBulletCollisions = function (bullets, circleBumpers) {
        for (var _i = 0, bullets_1 = bullets; _i < bullets_1.length; _i++) {
            var bullet = bullets_1[_i];
            this.checkBulletAgainstCircleBumpers(bullet, circleBumpers);
        }
    };
    CollisionManager.prototype.checkBulletAgainstCircleBumpers = function (bullet, circleBumpers) {
        for (var _i = 0, circleBumpers_1 = circleBumpers; _i < circleBumpers_1.length; _i++) {
            var bumper = circleBumpers_1[_i];
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, bullet.position, bullet.radius)) {
                var colNormal = Utils.getTargetDirectionNormal(bumper.position, bullet.position);
                // Adjust bullet direction
                bullet.direction = Point.Reflect(bullet.direction, colNormal);
                // Adjust bullet position by collision normal to prevent further collisions
                colNormal.x *= bullet.moveSpeed;
                colNormal.y *= bullet.moveSpeed;
                bullet.position.x = bullet.position.x - colNormal.x;
                bullet.position.y = bullet.position.y - colNormal.y;
            }
        }
    };
    CollisionManager.prototype.checkPlayerCollisions = function (player) {
    };
    return CollisionManager;
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
/// <reference path="bumpers.ts" />
/// <reference path="utils.ts" />
/// <reference path="collisionManager.ts" />
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
        this.colMgr = new CollisionManager();
        this.player = new Player();
        this.circleBumpers = [];
        this.setupBumpers();
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
    GameState.prototype.setupBumpers = function () {
        this.circleBumpers.push(new CircleBumper(new Point(500, 150), "orange", 5, 70));
        this.circleBumpers.push(new CircleBumper(new Point(250, 300), "orange", 5, 50));
        this.circleBumpers.push(new CircleBumper(new Point(750, 300), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(500, 500), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(200, 600), "orange", 5, 80));
        this.circleBumpers.push(new CircleBumper(new Point(750, 650), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(500, 800), "orange", 5, 40));
    };
    GameState.prototype.updateAll = function () {
        // Collision checks
        if (this.player.bullets.length > 0) {
            this.colMgr.checkBulletCollisions(this.player.bullets, this.circleBumpers);
        }
        /*
        if (this.player.bullets.length > 0) {
            for (let bullet of this.player.bullets) {
                // Check for bumper collisions
                for (let bumper of this.circleBumpers) {
                    if (Utils.CirclesIntersect(bumper.position, bumper.radius, bullet.position, bullet.radius)) {
                        let colNormal: Point = Utils.getTargetDirectionNormal(bumper.position, bullet.position);
                        // Adjust bullet direction
                        bullet.direction = Point.Reflect(bullet.direction, colNormal);
                        // Adjust bullet position by collision normal to prevent further collisions
                        colNormal.x *= bullet.moveSpeed;
                        colNormal.y *= bullet.moveSpeed;
                        bullet.position.x = bullet.position.x - colNormal.x;
                        bullet.position.y = bullet.position.y - colNormal.y;
                    }
                }
            }
        }
        */
        // Update player
        this.player.update();
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
        // Render bumpers
        for (var _b = 0, _c = this.circleBumpers; _b < _c.length; _b++) {
            var bumper = _c[_b];
            bumper.draw();
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