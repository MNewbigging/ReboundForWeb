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
    Point.Add = function (p1, p2) {
        return new Point(p1.x + p2.x, p1.y + p2.y);
    };
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
    Utils.ReboundOffset = function (p1, p2, step) {
        var colNorm = Utils.getTargetDirectionNormal(p1, p2);
        colNorm.x *= step;
        colNorm.y *= step;
        return colNorm;
    };
    // p1, p2 are for line end points
    // center is center point of circle 
    Utils.CircleToLineIntersect = function (p1, p2, center, radius) {
        // Find closest point on line from center given
        var closestPoint = new Point();
        // Get the line from two points given, normalize
        var line = Point.Subtract(p2, p1);
        var lineNorm = Point.Normalize(line);
        // Get distance form player to p1
        var p1Distance = Point.Subtract(center, p1);
        // Use dot product to check if p1 is closest point
        var projection = Point.Dot(p1Distance, lineNorm);
        if (projection < 0) {
            closestPoint = p1;
        }
        else if (projection > Point.Length(line)) {
            closestPoint = p2;
        }
        else {
            // Closest point is more central on the line
            var projectionVelocity = new Point(lineNorm.x * projection, lineNorm.y * projection);
            closestPoint = Point.Add(projectionVelocity, p1);
        }
        var closestDifference = Point.Subtract(center, closestPoint);
        var closestLength = Point.Length(closestDifference);
        if (closestLength <= radius) {
            return true;
        }
        return false;
    };
    Utils.isCircleInsideRectArea = function (rectPos, rectWidth, rectHeight, circlePos, circleRadius) {
        var circleInside = false;
        var xIntersect = false;
        var yIntersect = false;
        // Get distance vector between rect pos (top left origin) and circle pos
        var distance = Point.Subtract(rectPos, circlePos);
        if (distance.x > 0 && distance.x < circleRadius) {
            xIntersect = true;
        }
        else if (distance.x <= 0 && Math.abs(distance.x) < rectWidth + circleRadius) {
            xIntersect = true;
        }
        if (distance.y > 0 && distance.y < circleRadius) {
            yIntersect = true;
        }
        else if (distance.y <= 0 && Math.abs(distance.y) < rectHeight + circleRadius) {
            yIntersect = true;
        }
        if (xIntersect && yIntersect) {
            circleInside = true;
        }
        return circleInside;
    };
    Utils.getRandomNumber = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
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
var RectangleEntity = /** @class */ (function () {
    function RectangleEntity(p, col, lw, w, h, stroke) {
        this.canvasUtils = CanvasUtils.getInstance();
        this.position = p;
        this.color = col;
        this.lineWidth = lw;
        this.width = w;
        this.height = h;
        this.strokeStyle = stroke;
    }
    RectangleEntity.prototype.draw = function () {
        var canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.strokeStyle = this.strokeStyle;
        canvasContext.fillStyle = this.color;
        canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
        canvasContext.stroke();
        canvasContext.restore();
    };
    return RectangleEntity;
}());
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
    function Bullet(p, dir) {
        var _this = _super.call(this, p, "grey", 1, 5, dir, 12) || this;
        _this.alive = true; // TODO rename to outOfBounds or similar
        _this.damageMultiplier = 0;
        _this.damage = 100;
        _this.reboundRadiusGrowthStep = 2;
        return _this;
    }
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        this.checkIfOutOfBounds();
        this.checkCollisions();
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
    Bullet.prototype.checkCollisions = function () {
        this.checkCollisionsWithCircleBumpers();
        this.checkCollisionsWithRectBumpers();
        this.checkCollisionWithEnemies();
    };
    Bullet.prototype.checkCollisionsWithCircleBumpers = function () {
        for (var _i = 0, _a = EntityManager.getInstance().getCircleBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, this.position, this.radius)) {
                var colNormal = Utils.getTargetDirectionNormal(bumper.position, this.position);
                // Adjust bullet direction before colNorm * speed
                this.direction = Point.Reflect(this.direction, colNormal);
                // Adjust bullet position by collision normal to prevent further collisions
                colNormal.x *= this.moveSpeed;
                colNormal.y *= this.moveSpeed;
                this.position.x -= colNormal.x;
                this.position.y -= colNormal.y;
                // Apply any other effects on rebound
                this.applyReboundEffects();
                break;
            }
        }
    };
    Bullet.prototype.checkCollisionsWithRectBumpers = function () {
        for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            // Basic distance check before continuing with collision detection
            // Center point of rect bumper
            var rectCenter = new Point(bumper.position.x + bumper.width / 2, bumper.position.y + bumper.height / 2);
            var distance = Point.Subtract(rectCenter, this.position);
            if (Point.LengthSq(distance) < 0.3 * Point.LengthSq(new Point(bumper.width, bumper.height))) {
                for (var i = 0; i < bumper.vertices.length; i++) {
                    if (i === 3) {
                        if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[0], this.position, this.radius)) {
                            this.adjustDirectionFromRectCollision(i);
                            break;
                        }
                    }
                    else if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[i + 1], this.position, this.radius)) {
                        this.adjustDirectionFromRectCollision(i);
                        break;
                    }
                }
                break;
            }
        }
    };
    Bullet.prototype.adjustDirectionFromRectCollision = function (side) {
        if (side === 0 || side === 2) {
            this.direction.y = -this.direction.y;
        }
        else if (side === 1 || side === 3) {
            this.direction.x = -this.direction.x;
        }
        // Move back to avoid futher collisions
        this.position.x += this.direction.x * this.moveSpeed;
        this.position.y += this.direction.y * this.moveSpeed;
        // Apply other rebound effects
        this.applyReboundEffects();
    };
    Bullet.prototype.applyReboundEffects = function () {
        this.damageMultiplier += 1;
        this.radius += this.reboundRadiusGrowthStep;
        this.color = "red";
    };
    Bullet.prototype.checkCollisionWithEnemies = function () {
        // Only run checks for enemies if we have a damage greater than 0!
        if (this.damageMultiplier > 0) {
            for (var _i = 0, _a = EntityManager.getInstance().getEnemies(); _i < _a.length; _i++) {
                var enemy = _a[_i];
                if (Utils.CirclesIntersect(enemy.position, enemy.radius, this.position, this.radius)) {
                    // Damage the enemy
                    enemy.takeDamage(this.damage * this.damageMultiplier);
                    break;
                }
            }
        }
    };
    return Bullet;
}(CircleMovingEntity));
/// <reference path="entities.ts" />
/// <reference path="utils.ts" />
var CircleBumper = /** @class */ (function (_super) {
    __extends(CircleBumper, _super);
    function CircleBumper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return CircleBumper;
}(CircleEntity));
var RectangleBumper = /** @class */ (function (_super) {
    __extends(RectangleBumper, _super);
    function RectangleBumper(p, col, lw, w, h, stroke) {
        var _this = _super.call(this, p, col, lw, w, h, stroke) || this;
        _this.vertices = [];
        _this.findVertices();
        return _this;
    }
    RectangleBumper.prototype.findVertices = function () {
        this.vertices.push(this.position);
        this.vertices.push(new Point(this.position.x + this.width, this.position.y));
        this.vertices.push(new Point(this.position.x + this.width, this.position.y + this.height));
        this.vertices.push(new Point(this.position.x, this.position.y + this.height));
    };
    return RectangleBumper;
}(RectangleEntity));
/// <reference path="entities.ts" />
/// <reference path="utils.ts" />
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.alive = true;
        _this.health = 100;
        // Denies changing direction in update (allows for simple impulses)
        _this.directionCooldown = 0;
        return _this;
    }
    Enemy.prototype.update = function () {
        // Only continue if haven't hit player
        if (!this.enemyHasCollidedWithPlayer()) {
            // direction cooldown tick
            this.directionCooldown -= 1;
            // Check for bumpers
            this.checkCollisionsWithBumpers();
            // Move towards player if allowed
            if (this.directionCooldown <= 0) {
                var playerToEnemy = Point.Subtract(EntityManager.getInstance().getPlayer().position, this.position);
                this.direction = Point.Normalize(playerToEnemy);
            }
            // Move
            _super.prototype.update.call(this);
        }
        // Player has been hit
        else {
            // Damage player
        }
    };
    Enemy.prototype.enemyHasCollidedWithPlayer = function () {
        if (Utils.CirclesIntersect(EntityManager.getInstance().getPlayer().position, EntityManager.getInstance().getPlayer().radius, this.position, this.radius)) {
            return true;
        }
        return false;
    };
    Enemy.prototype.checkCollisionsWithBumpers = function () {
        this.checkCollisionsWithCircleBumpers();
        this.checkCollisionsWithRectBumpers();
    };
    Enemy.prototype.checkCollisionsWithCircleBumpers = function () {
        for (var _i = 0, _a = EntityManager.getInstance().getCircleBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, this.position, this.radius)) {
                // Give impulse similar to bullet bounce
                var colNormal = Utils.getTargetDirectionNormal(bumper.position, this.position);
                this.direction = Point.Reflect(this.direction, colNormal);
                this.directionCooldown = 20;
                break;
            }
        }
    };
    Enemy.prototype.checkCollisionsWithRectBumpers = function () {
        for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
                for (var i = 0; i < bumper.vertices.length; i++) {
                    if (i === 3) {
                        if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[0], this.position, this.radius)) {
                            this.adjustDirectionFromRectCollision(i);
                            break;
                        }
                    }
                    else if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[i + 1], this.position, this.radius)) {
                        this.adjustDirectionFromRectCollision(i);
                        break;
                    }
                }
                this.directionCooldown = 20;
                break;
            }
        }
    };
    Enemy.prototype.adjustDirectionFromRectCollision = function (side) {
        if (side === 0 || side === 2) {
            this.direction.y = -this.direction.y;
        }
        else if (side === 1 || side === 3) {
            this.direction.x = -this.direction.x;
        }
        // Move back to avoid futher collisions
        this.position.x += this.direction.x * this.moveSpeed;
        this.position.y += this.direction.y * this.moveSpeed;
    };
    Enemy.prototype.takeDamage = function (damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
        }
    };
    return Enemy;
}(CircleMovingEntity));
/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Point(20, 20), "green", 2, 10, new Point(), 5) || this;
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
        // Only move the player if it won't collide with an obstacle
        if (!this.playerWillCollideWithBumper()) {
            _super.prototype.update.call(this);
        }
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
    Player.prototype.playerWillCollideWithBumper = function () {
        var playerWillCollide = false;
        // Simulate where player will be next frame
        var nextPos = new Point(this.position.x, this.position.y);
        var speed = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        nextPos.x += (this.direction.x * speed);
        nextPos.y += (this.direction.y * speed);
        // Use the next frame pos to check for collisions
        for (var _i = 0, _a = EntityManager.getInstance().getCircleBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, nextPos, this.radius)) {
                playerWillCollide = true;
                break;
            }
        }
        for (var _b = 0, _c = EntityManager.getInstance().getRectBumpers(); _b < _c.length; _b++) {
            var bumper = _c[_b];
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, nextPos, this.radius)) {
                playerWillCollide = true;
                break;
            }
        }
        return playerWillCollide;
    };
    return Player;
}(CircleMovingEntity));
/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />
/// <reference path="canvasUtils.ts" />
var EntityManager = /** @class */ (function () {
    function EntityManager() {
        this.maxEnemyCount = 10;
        this.player = new Player();
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.enemies = [];
        this.spawnPoints = [];
        this.setupBumpers();
        this.setupEnemies();
    }
    EntityManager.getInstance = function () {
        if (!this.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    };
    EntityManager.prototype.getPlayer = function () {
        return this.player;
    };
    EntityManager.prototype.getCircleBumpers = function () {
        return this.circleBumpers;
    };
    EntityManager.prototype.getRectBumpers = function () {
        return this.rectBumpers;
    };
    EntityManager.prototype.getEnemies = function () {
        return this.enemies;
    };
    EntityManager.prototype.setupBumpers = function () {
        var lineWidth = 1;
        this.circleBumpers.push(new CircleBumper(new Point(460, 320), "orange", lineWidth, 60));
        var rectWidth = 300;
        var rectHeight = 80;
        this.rectBumpers.push(new RectangleBumper(new Point(600, 280), "blue", lineWidth, rectWidth, rectHeight, "black"));
        this.rectBumpers.push(new RectangleBumper(new Point(40, 280), "blue", lineWidth, rectWidth, rectHeight, "black"));
        this.rectBumpers.push(new RectangleBumper(new Point(420, -100), "blue", lineWidth, rectHeight, rectWidth, "black"));
        this.rectBumpers.push(new RectangleBumper(new Point(420, 460), "blue", lineWidth, rectHeight, rectWidth, "black"));
    };
    EntityManager.prototype.setupEnemies = function () {
        this.enemies.push(new Enemy(new Point(50, 50), "black", 1, 15, new Point(), 3));
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        this.spawnPoints.push(new Point(-50, -50));
        this.spawnPoints.push(new Point(canvasWidth + 50, -50));
        this.spawnPoints.push(new Point(canvasWidth, canvasHeight + 50));
        this.spawnPoints.push(new Point(-50, canvasHeight));
        this.spawnPoints.push(new Point(canvasWidth / 2, canvasHeight + 50));
    };
    EntityManager.prototype.updateEntities = function () {
        this.player.update();
        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            enemy.update();
        }
        this.removeDeadEnemies();
        this.spawnEnemies();
    };
    EntityManager.prototype.removeDeadEnemies = function () {
        for (var i = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
            }
        }
    };
    EntityManager.prototype.spawnEnemies = function () {
        if (this.enemies.length < this.maxEnemyCount) {
            // Get random spawn point
            this.enemies.push(new Enemy(this.spawnPoints[Utils.getRandomNumber(this.spawnPoints.length)], "black", 1, 15, new Point(), 3));
        }
        else {
            console.log("max enemies");
        }
    };
    EntityManager.prototype.renderEntities = function () {
        // Player
        this.player.draw();
        // Player bullets
        if (this.player.bullets.length > 0) {
            for (var _i = 0, _a = this.player.bullets; _i < _a.length; _i++) {
                var bullet = _a[_i];
                bullet.draw();
            }
        }
        // Bumpers
        for (var _b = 0, _c = this.circleBumpers; _b < _c.length; _b++) {
            var bumper = _c[_b];
            bumper.draw();
        }
        for (var _d = 0, _e = this.rectBumpers; _d < _e.length; _d++) {
            var bumper = _e[_d];
            bumper.draw();
        }
        // Enemies
        if (this.enemies.length > 0) {
            for (var _f = 0, _g = this.enemies; _f < _g.length; _f++) {
                var enemy = _g[_f];
                enemy.draw();
            }
        }
    };
    return EntityManager;
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
/// <reference path="keyboardInput.ts" />
/// <reference path= "canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />
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
        this.entityMgr = EntityManager.getInstance();
        this.defineInputActions();
    }
    GameState.prototype.defineInputActions = function () {
        // Add movement functions as callbacks
        // Left arrow / a
        this.keyInput.addKeycodeCallback(37, this.entityMgr.getPlayer().moveLeft);
        this.keyInput.addKeycodeCallback(65, this.entityMgr.getPlayer().moveLeft);
        // Right arrow / d
        this.keyInput.addKeycodeCallback(39, this.entityMgr.getPlayer().moveRight);
        this.keyInput.addKeycodeCallback(68, this.entityMgr.getPlayer().moveRight);
        // Up arrow / w
        this.keyInput.addKeycodeCallback(38, this.entityMgr.getPlayer().moveUp);
        this.keyInput.addKeycodeCallback(87, this.entityMgr.getPlayer().moveUp);
        // down arrow / s
        this.keyInput.addKeycodeCallback(40, this.entityMgr.getPlayer().moveDown);
        this.keyInput.addKeycodeCallback(83, this.entityMgr.getPlayer().moveDown);
        // Fire
        this.keyInput.addKeycodeCallback(32, this.entityMgr.getPlayer().fireShot);
    };
    GameState.prototype.updateAll = function () {
        EntityManager.getInstance().updateEntities();
    };
    GameState.prototype.renderAll = function () {
        EntityManager.getInstance().renderEntities();
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