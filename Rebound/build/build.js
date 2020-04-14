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
    Point.Distance = function (p1, p2) {
        var distanceVector = Point.Subtract(p2, p1);
        return Point.Length(distanceVector);
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
        // Get absolute distance between rect and circle
        var dx = Math.abs(circlePos.x - (rectPos.x + rectWidth * 0.5));
        var dy = Math.abs(circlePos.y - (rectPos.y + rectHeight * 0.5));
        if (dx > circleRadius + rectWidth * 0.5) {
            return false;
        }
        if (dy > circleRadius + rectHeight * 0.5) {
            return false;
        }
        if (dx <= rectWidth) {
            return true;
        }
        if (dy <= rectHeight) {
            return true;
        }
        dx -= rectWidth;
        dy -= rectHeight;
        return (dx * dx + dy * dy <= circleRadius * circleRadius);
    };
    Utils.getRandomNumber = function (max) {
        return Math.floor(Math.random() * Math.floor(max));
    };
    Utils.getClosestPointOnRectToCircle = function (rectPos, rectWidth, rectHeight, circlePos) {
        var closestXpoint;
        var rectLeftPos = rectPos.x;
        var rectRightPos = rectPos.x + rectWidth;
        // check if already within x bounds of rect
        if (circlePos.x > rectLeftPos && circlePos.x < rectRightPos) {
            closestXpoint = circlePos.x;
        }
        else {
            // If not already within bounds, find closest x value
            var distanceLeft = Math.abs(rectLeftPos - circlePos.x);
            var distanceRight = Math.abs(rectRightPos - circlePos.x);
            closestXpoint = (Math.min(distanceLeft, distanceRight) === distanceLeft) ? rectLeftPos : rectRightPos;
        }
        var closestYpoint;
        var rectTopPos = rectPos.y;
        var rectBotPos = rectPos.y + rectHeight;
        if (circlePos.y > rectTopPos && circlePos.y < rectBotPos) {
            closestYpoint = circlePos.y;
        }
        else {
            var distanceTop = Math.abs(rectTopPos - circlePos.y);
            var distanceBot = Math.abs(rectBotPos - circlePos.y);
            closestYpoint = (Math.min(distanceTop, distanceBot) === distanceTop) ? rectTopPos : rectBotPos;
        }
        return new Point(closestXpoint, closestYpoint);
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
        var _this = _super.call(this, p, "grey", 1, 5, dir, 8) || this;
        _this.outOfBounds = false;
        _this.damageMultiplier = 0;
        _this.damage = 100;
        _this.reboundRadiusGrowthStep = 1;
        return _this;
    }
    Bullet.prototype.update = function () {
        _super.prototype.update.call(this);
        this.checkIfOutOfBounds();
        this.checkCollisions();
    };
    Bullet.prototype.checkIfOutOfBounds = function () {
        if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.x, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
        else if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.y, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
        else if (this.canvasUtils.outOfBoundsRight(this.position.x, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
        else if (this.canvasUtils.outOfBoundsBottom(this.position.y, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
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
        bumperLoop: for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
                // Treat this position as previous (which was outside of collision area)
                var prevPos = new Point(this.position.x -= this.direction.x * this.moveSpeed, this.position.y -= this.direction.y * this.moveSpeed);
                // Get collision normal
                var closestPoint = Utils.getClosestPointOnRectToCircle(bumper.position, bumper.width, bumper.height, prevPos);
                var colNormal = Utils.getTargetDirectionNormal(closestPoint, prevPos);
                // Reflect
                this.direction = Point.Reflect(this.direction, colNormal);
                // Apply other rebound effects
                this.applyReboundEffects();
                // Can't hit more than one bumper at once, break
                break bumperLoop;
            }
        }
    };
    Bullet.prototype.applyReboundEffects = function () {
        this.damageMultiplier += 1;
        // TODO - move bullet out of colliding rect by penetration distance + new radius (to avoid further collisions)
        // OR increase radius over time, or after delay, so bullet has rebounded already when it grows
        //this.radius += this.reboundRadiusGrowthStep;
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
                    // Remove this bullet
                    this.outOfBounds = true;
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
    function RectangleBumper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return RectangleBumper;
}(RectangleEntity));
/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this, new Point(20, 20), "green", 2, 10, new Point(), 5) || this;
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
                    // Reset bullet cooldown timer
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
        // Clear current dir to stop player moving into next frame
        this.direction.x = 0;
        this.direction.y = 0;
        // Clear or update dead/live bullets
        this.manageBullets();
    };
    Player.prototype.playerWillCollideWithBumper = function () {
        var playerWillCollide = false;
        // Simulate where player will be next frame
        var nextPos = new Point(this.position.x, this.position.y);
        var speed = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        nextPos.x += (this.direction.x * speed);
        nextPos.y += (this.direction.y * speed);
        // Use the next frame pos to check for collisions with circle bumpers
        for (var _i = 0, _a = EntityManager.getInstance().getCircleBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, nextPos, this.radius)) {
                playerWillCollide = true;
                break;
            }
        }
        // Do the same collision checks against rectangle bumpers
        for (var _b = 0, _c = EntityManager.getInstance().getRectBumpers(); _b < _c.length; _b++) {
            var bumper = _c[_b];
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, nextPos, this.radius)) {
                playerWillCollide = true;
                break;
            }
        }
        return playerWillCollide;
    };
    Player.prototype.manageBullets = function () {
        // Remove any dead bullets (outside of canvas) and update the rest
        for (var i = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].outOfBounds) {
                this.bullets.splice(i, 1);
            }
            else {
                this.bullets[i].update();
            }
        }
    };
    return Player;
}(CircleMovingEntity));
/// <reference path="entities.ts" />
var EnemyTargetZone = /** @class */ (function (_super) {
    __extends(EnemyTargetZone, _super);
    function EnemyTargetZone(id, p, col, lw, r) {
        var _this = _super.call(this, p, col, lw, r) || this;
        // Tracks lives
        _this.maxLives = 1;
        // Visual cue for lives remaining - the threat circle
        _this.threatCircleRadius = 0;
        _this.threatCircleColor = "red";
        _this.targetZoneId = id;
        _this.remainingLives = _this.maxLives;
        return _this;
    }
    EnemyTargetZone.prototype.reduceLives = function () {
        this.remainingLives -= 1;
        if (this.remainingLives <= 0) {
            this.targetZoneDestroyed();
        }
        // Recalculate inner circle radius
        this.recalculateThreatCircleRadius();
    };
    EnemyTargetZone.prototype.targetZoneDestroyed = function () {
        // Tell the entity manager this zone is no longer a target
        EntityManager.getInstance().removeTargetZone(this.targetZoneId);
    };
    EnemyTargetZone.prototype.recalculateThreatCircleRadius = function () {
        // Find inverse percentage of lives remaining vs max lives
        var percentage = 100 - (100 * this.remainingLives) / this.maxLives;
        // That's the percentage of total target zone radius for the threat circle
        this.threatCircleRadius = this.radius * (percentage / 100);
    };
    EnemyTargetZone.prototype.draw = function () {
        _super.prototype.draw.call(this);
        // Draw threat circle
        var canvasContext = CanvasUtils.getInstance().getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.threatCircleRadius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.threatCircleColor;
        canvasContext.stroke();
        canvasContext.fillStyle = this.threatCircleColor;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    };
    return EnemyTargetZone;
}(CircleEntity));
/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="targetZones.ts" />
var EntityManager = /** @class */ (function () {
    function EntityManager() {
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.enemies = [];
        this.enemyTargetZones = [];
        this.enemyTargetZoneIndices = [];
        this.setupBumpers();
        this.setupTargetZones();
        this.setupEnemies();
        this.player = new Player();
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
    EntityManager.prototype.getEnemyTargetZones = function () {
        return this.enemyTargetZones;
    };
    EntityManager.prototype.getEnemyTargetZoneIndices = function () {
        return this.enemyTargetZoneIndices;
    };
    EntityManager.prototype.setupBumpers = function () {
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        // Rectangle Bumpers
        var rectWidth = canvasWidth * 0.6;
        var rectHeight = canvasHeight * 0.1;
        var lineWidth = 1;
        this.rectBumpers.push(new RectangleBumper(new Point(canvasWidth * 0.2, canvasHeight * 0.35), "black", lineWidth, rectWidth, rectHeight, "black"));
        // Circle Bumpers
        var circleBumperRadius = 40;
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.1, canvasHeight * 0.2), "orange", lineWidth, circleBumperRadius));
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.9, canvasHeight * 0.2), "orange", lineWidth, circleBumperRadius));
    };
    EntityManager.prototype.setupTargetZones = function () {
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        var maxTargetZones = 2;
        var zonesInterval = canvasWidth / maxTargetZones;
        for (var i = 0; i < maxTargetZones; i++) {
            // Create the target zone
            this.enemyTargetZones.push(new EnemyTargetZone(i, new Point(100 + i * zonesInterval, canvasHeight * 0.8), "purple", 1, 30));
            // Add tz id to array
            this.enemyTargetZoneIndices.push(i);
        }
    };
    EntityManager.prototype.setupEnemies = function () {
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        var enemyCount = 5;
        var intervalX = canvasWidth / enemyCount;
        for (var i = 0; i < enemyCount; i++) {
            this.enemies.push(new Enemy(new Point(50 + i, canvasHeight * 0.1), "black", 1, 15, new Point(), 3));
            this.enemies[i].setTargetZone(this.enemyTargetZones, this.enemyTargetZoneIndices);
        }
    };
    EntityManager.prototype.updateEntities = function () {
        this.player.update();
        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            enemy.update();
        }
        this.removeDeadEnemies();
    };
    EntityManager.prototype.removeDeadEnemies = function () {
        // TODO - move this so it isn't called in update
        for (var i = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
            }
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
        // Enemy target zones
        for (var _f = 0, _g = this.enemyTargetZones; _f < _g.length; _f++) {
            var tz = _g[_f];
            tz.draw();
        }
        // Enemies
        if (this.enemies.length > 0) {
            for (var _h = 0, _j = this.enemies; _h < _j.length; _h++) {
                var enemy = _j[_h];
                enemy.draw();
            }
        }
    };
    EntityManager.prototype.removeTargetZone = function (zoneIndex) {
        // Remove the dead tz from indices array
        for (var i = 0; i < this.enemyTargetZoneIndices.length; i++) {
            if (this.enemyTargetZoneIndices[i] === zoneIndex) {
                this.enemyTargetZoneIndices.splice(i, 1);
            }
        }
        // Any enemy with the removed zone's id gets a new zone id
        for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
            var enemy = _a[_i];
            if (enemy.targetZoneIndex === zoneIndex) {
                enemy.setTargetZone(this.enemyTargetZones, this.enemyTargetZoneIndices);
            }
        }
    };
    return EntityManager;
}());
/// <reference path="entities.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(p, col, lw, r, dir, speed) {
        var _this = _super.call(this, p, col, lw, r, dir, speed) || this;
        _this.alive = true;
        _this.health = 100;
        // Denies changing direction in update (allows for simple impulses)
        _this.directionCooldown = 0;
        // Default targeted zone for this enemy; random index within tz list
        _this.targetZoneIndex = 0;
        return _this;
    }
    Enemy.prototype.setTargetZone = function (targetZones, targetZoneIndices) {
        // Set target zone index to nearest tz at spawn time
        var closestDistance = CanvasUtils.getInstance().getCanvas().width;
        var closestTzIndex = 0;
        // Use indices array rather than directly in tz array, in case some tzs aren't valid targets       
        for (var _i = 0, targetZoneIndices_1 = targetZoneIndices; _i < targetZoneIndices_1.length; _i++) {
            var tzIndex = targetZoneIndices_1[_i];
            // Check distance, overwrite if lower than current closest dist value
            var distance = Point.Distance(this.position, targetZones[tzIndex].position);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTzIndex = tzIndex;
            }
        }
        this.targetZoneIndex = closestTzIndex;
        console.log("set target to: " + this.targetZoneIndex);
    };
    Enemy.prototype.update = function () {
        // Only continue if haven't hit player
        if (!this.enemyHasCollidedWithPlayer()) {
            // direction cooldown tick
            this.directionCooldown -= 1;
            // Check for bumpers
            this.checkCollisionsWithBumpers();
            // Check for other enemies
            // Set direction
            this.setFacingDirection();
            // Move
            _super.prototype.update.call(this);
        }
        // Player has been hit
        else {
            // Damage player - repawn after delay (in meantime enemies head towads target zones)
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
        bumperLoop: for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
                // Treat this position as previous (which was outside of collision area)
                // Avoids normalising two potentially identical points for nan result
                var prevPos = new Point(this.position.x -= this.direction.x * this.moveSpeed, this.position.y -= this.direction.y * this.moveSpeed);
                // Get collision normal
                var closestPoint = Utils.getClosestPointOnRectToCircle(bumper.position, bumper.width, bumper.height, prevPos);
                var colNormal = Utils.getTargetDirectionNormal(closestPoint, prevPos);
                // Reflect
                this.direction = Point.Reflect(this.direction, colNormal);
                this.directionCooldown = 20;
                // Can't collide with more than 1 bumper
                break bumperLoop;
            }
        }
    };
    Enemy.prototype.checkTargetZoneReached = function (distance) {
        var bounds = 2;
        if (distance < bounds) {
            // reached target zone
            EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].reduceLives();
            this.alive = false;
        }
    };
    Enemy.prototype.setFacingDirection = function () {
        // Set direction if no impulse is currently active
        if (this.directionCooldown <= 0) {
            this.direction = this.getPriorityTargetDirectionNormal();
        }
    };
    Enemy.prototype.getPriorityTargetDirectionNormal = function () {
        // Compare distance to this enemy's target zone and the distance to player
        var distanceToPlayer = Point.Length(Point.Subtract(EntityManager.getInstance().getPlayer().position, this.position));
        var distanceTotz = Point.Length(Point.Subtract(EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].position, this.position));
        // While we have disatnce calculated here, check if reached target zone already
        this.checkTargetZoneReached(distanceTotz);
        if (distanceToPlayer < distanceTotz) {
            // Head for player
            return Utils.getTargetDirectionNormal(EntityManager.getInstance().getPlayer().position, this.position);
        }
        else {
            // Head for target zone
            return Utils.getTargetDirectionNormal(EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].position, this.position);
        }
    };
    Enemy.prototype.takeDamage = function (damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
        }
    };
    return Enemy;
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