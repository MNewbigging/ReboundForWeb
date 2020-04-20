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
    Utils.getRadiansFromDegrees = function (degree) {
        return degree * Math.PI / 180;
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
        _this.alive = true;
        _this.damageMultiplier = 0;
        _this.damage = 100;
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
        // Only check closest one
        var closestIndex = EntityManager.getInstance().getClosestCircleBumperIndex(this.position);
        var bumpers = EntityManager.getInstance().getCircleBumpers();
        if (Utils.CirclesIntersect(bumpers[closestIndex].position, bumpers[closestIndex].radius, this.position, this.radius)) {
            // Get collision normal
            var colNormal = Utils.getTargetDirectionNormal(bumpers[closestIndex].position, this.position);
            // Adjust bullet direction before colNorm * speed
            this.direction = Point.Reflect(this.direction, colNormal);
            // Adjust bullet position by collision normal to prevent further collisions
            colNormal.x *= this.moveSpeed;
            colNormal.y *= this.moveSpeed;
            this.position.x -= colNormal.x;
            this.position.y -= colNormal.y;
            // Apply any other effects on rebound
            this.applyReboundEffects();
        }
    };
    Bullet.prototype.checkCollisionsWithRectBumpers = function () {
        for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
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
                break;
            }
        }
    };
    Bullet.prototype.applyReboundEffects = function () {
        this.damageMultiplier += 1;
        // TODO - increase bullet radius on hit. Need to move out of collision area by how far bullet penetrates collider to work
        this.color = "red";
    };
    Bullet.prototype.checkCollisionWithEnemies = function () {
        // Only run checks for enemies if we have a damage greater than 0!
        if (this.damageMultiplier > 0) {
            // Only check closest enemy
            var closestIndex = EntityManager.getInstance().getClosestEnemyIndex(this.position);
            var enemies = EntityManager.getInstance().getEnemies();
            if (Utils.CirclesIntersect(enemies[closestIndex].position, enemies[closestIndex].radius, this.position, this.radius)) {
                // Damage the enemy
                enemies[closestIndex].takeDamage(this.damage * this.damageMultiplier);
                // Mark bullet for removal
                this.alive = true;
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
    function Player(pos) {
        var _this = _super.call(this, pos, "green", 2, 10, new Point(), 5) || this;
        _this.maxBullets = 30;
        _this.timeBetweenShots = 0;
        _this.maxTimeBetweenShots = 30;
        _this.alive = true;
        _this.respawnCooldownMax = 100;
        _this.respawnCooldown = 0;
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
            // Ensure player is alive and hasn't reached max bullet count yet
            if (_this.alive && _this.bullets.length < _this.maxBullets) {
                // and make sure time between shots has run out
                if (_this.timeBetweenShots <= 0) {
                    _this.bullets.push(new Bullet(new Point(_this.position.x, _this.position.y), Utils.getTargetDirectionNormal(_this.canvasUtils.getMousePos(), _this.position)));
                    // Reset bullet cooldown timer
                    _this.timeBetweenShots = _this.maxTimeBetweenShots;
                }
            }
        };
        _this.spawnPoint = new Point(pos.x, pos.y);
        _this.bullets = [];
        return _this;
    }
    Player.prototype.update = function () {
        // If dead, tick down respawn cooldown timer
        if (!this.alive) {
            if (this.respawnCooldown <= 0) {
                this.respawn();
            }
            else {
                this.respawnCooldown--;
            }
        }
        else {
            // Only move the player if it won't collide with an obstacle
            if (!this.playerWillCollideWithBumper()) {
                _super.prototype.update.call(this);
            }
            // Tick down time between shots
            this.timeBetweenShots -= 1;
            // Clear current dir to stop player moving into next frame
            this.direction.x = 0;
            this.direction.y = 0;
        }
        // Update bullets
        for (var _i = 0, _a = this.bullets; _i < _a.length; _i++) {
            var bullet = _a[_i];
            bullet.update();
        }
    };
    Player.prototype.playerWillCollideWithBumper = function () {
        // Simulate where player will be next frame
        var nextPos = new Point(this.position.x, this.position.y);
        var speed = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        nextPos.x += (this.direction.x * speed);
        nextPos.y += (this.direction.y * speed);
        // Only test against closest circle bumper
        var closest = EntityManager.getInstance().getClosestCircleBumperIndex(nextPos);
        var bumpers = EntityManager.getInstance().getCircleBumpers();
        if (Utils.CirclesIntersect(bumpers[closest].position, bumpers[closest].radius, nextPos, this.radius)) {
            return true;
        }
        // Do collision checks against all rectangle bumpers
        // This is actually cheaper than only testing closest, because you would 
        // need to test against closest point on rectangle to player, not rect pos/center
        for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
            var bumper = _a[_i];
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, nextPos, this.radius)) {
                return true;
            }
        }
        return false;
    };
    Player.prototype.die = function () {
        // Die
        this.alive = false;
        // Reset respawn timer
        this.respawnCooldown = this.respawnCooldownMax;
        // Change position back to spawn point
        this.position = new Point(this.spawnPoint.x, this.spawnPoint.y);
        // Update UI element to show we are respawning
        var respawnElement = document.getElementById("respawn");
        if (respawnElement) {
            respawnElement.innerHTML = "Systems Repairing...";
        }
    };
    Player.prototype.respawn = function () {
        this.alive = true;
        // Update UI element to show we have respawned
        var respawnElement = document.getElementById("respawn");
        if (respawnElement) {
            respawnElement.innerHTML = "Systems Online";
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
        _this.maxLives = 5;
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
/// <reference path="entities.ts" />
var EnemySpawnZone = /** @class */ (function (_super) {
    __extends(EnemySpawnZone, _super);
    function EnemySpawnZone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return EnemySpawnZone;
}(CircleEntity));
/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="targetZones.ts" />
/// <reference path="spawnZones.ts" />
var EntityManager = /** @class */ (function () {
    function EntityManager() {
        this.enemySpawnCooldownMax = 300;
        this.enemySpawnCooldown = 0;
        this.gameOver = false;
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.enemies = [];
        this.enemySpawnZones = [];
        this.enemyTargetZones = [];
        this.enemyTargetZoneIndices = [];
        this.playerScore = 0;
        this.setupBumpers();
        this.setupTargetZones();
        this.setupEnemySpawnZones();
        var playerPos = new Point(CanvasUtils.getInstance().getCanvas().width * 0.5, CanvasUtils.getInstance().getCanvas().height * 0.5);
        this.player = new Player(playerPos);
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
    EntityManager.prototype.getClosestCircleBumperIndex = function (position) {
        var closestIndex = -1;
        var closestDistanceSq = Infinity;
        for (var i = 0; i < this.circleBumpers.length; i++) {
            var distanceSq = Point.LengthSq(Point.Subtract(this.circleBumpers[i].position, position));
            if (distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                closestIndex = i;
            }
        }
        return closestIndex;
    };
    EntityManager.prototype.getRectBumpers = function () {
        return this.rectBumpers;
    };
    EntityManager.prototype.getEnemies = function () {
        return this.enemies;
    };
    EntityManager.prototype.getClosestEnemyIndex = function (position) {
        var closestIndex = -1;
        var closestDistanceSq = Infinity;
        for (var i = 0; i < this.enemies.length; i++) {
            var distanceSq = Point.LengthSq(Point.Subtract(this.enemies[i].position, position));
            if (distanceSq > 0 && distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                closestIndex = i;
            }
        }
        return closestIndex;
    };
    EntityManager.prototype.getEnemyTargetZones = function () {
        return this.enemyTargetZones;
    };
    EntityManager.prototype.getEnemyTargetZoneIndices = function () {
        return this.enemyTargetZoneIndices;
    };
    EntityManager.prototype.isGameOver = function () {
        return this.gameOver;
    };
    EntityManager.prototype.setupBumpers = function () {
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        this.addBumperSet(canvasWidth * 0.2, canvasHeight * 0.4);
        this.addBumperSet(canvasWidth * 0.8, canvasHeight * 0.4);
        // Top rect bumper
        this.rectBumpers.push(new RectangleBumper(new Point(canvasWidth * 0.25, 0), "black", 1, canvasWidth * 0.5, 30, "black"));
        // Bot rect bumper
        this.rectBumpers.push(new RectangleBumper(new Point(canvasWidth * 0.1, canvasHeight - 30), "black", 1, canvasWidth * 0.8, 30, "black"));
        // Bot left rect bumper
        this.rectBumpers.push(new RectangleBumper(new Point(0, canvasHeight * 0.6), "black", 1, 30, canvasHeight * 0.4, "black"));
        // Bot right rect bumper
        this.rectBumpers.push(new RectangleBumper(new Point(canvasWidth - 30, canvasHeight * 0.6), "black", 1, 30, canvasHeight * 0.4, "black"));
        // Centre circle bumper top
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.5, canvasHeight * 0.3), "orange", 1, 40));
        // Centre circle bumper bot
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.5, canvasHeight * 0.7), "orange", 1, 40));
    };
    // Adds preset bumper layout; circle with 4 squares outside on each axis
    EntityManager.prototype.addBumperSet = function (centerX, centerY) {
        var lineWidth = 1;
        var circleRadius = 30;
        var halfRadius = circleRadius * 0.5;
        var squareSide = 50;
        var halfSquareSide = squareSide * 0.5;
        var gap = 60;
        var rectColor = "black";
        // Center circle bumper
        this.circleBumpers.push(new CircleBumper(new Point(centerX, centerY), "orange", lineWidth, circleRadius));
        // Left rect
        this.rectBumpers.push(new RectangleBumper(new Point(centerX - halfRadius - gap - squareSide, centerY - halfSquareSide), rectColor, lineWidth, squareSide, squareSide, rectColor));
        // Right rect
        this.rectBumpers.push(new RectangleBumper(new Point(centerX + halfRadius + gap, centerY - halfSquareSide), rectColor, lineWidth, squareSide, squareSide, rectColor));
        // Top rect
        this.rectBumpers.push(new RectangleBumper(new Point(centerX - halfSquareSide, centerY - halfRadius - gap - squareSide), rectColor, lineWidth, squareSide, squareSide, rectColor));
        // Bot rect
        this.rectBumpers.push(new RectangleBumper(new Point(centerX - halfSquareSide, centerY + halfRadius + gap), rectColor, lineWidth, squareSide, squareSide, rectColor));
    };
    EntityManager.prototype.setupTargetZones = function () {
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        // Bottom left corner tz
        this.enemyTargetZones.push(new EnemyTargetZone(0, new Point(canvasWidth * 0.2, canvasHeight * 0.8), "purple", 1, 30));
        // Bottom right corner tz
        this.enemyTargetZones.push(new EnemyTargetZone(1, new Point(canvasWidth * 0.8, canvasHeight * 0.8), "purple", 1, 30));
        this.enemyTargetZoneIndices.push(0);
        this.enemyTargetZoneIndices.push(1);
    };
    EntityManager.prototype.setupEnemySpawnZones = function () {
        var canvasWidth = CanvasUtils.getInstance().getCanvas().width;
        var canvasHeight = CanvasUtils.getInstance().getCanvas().height;
        var spawnZoneA = new Point(canvasWidth * 0.1, canvasHeight * 0.1);
        var spawnZoneB = new Point(canvasWidth * 0.9, canvasHeight * 0.1);
        this.enemySpawnZones.push(new EnemySpawnZone(spawnZoneA, "yellow", 1, 20));
        this.enemySpawnZones.push(new EnemySpawnZone(spawnZoneB, "yellow", 1, 20));
    };
    EntityManager.prototype.updateEntities = function () {
        // Updating player also updates all bullets
        this.player.update();
        this.spawnEnemies();
        // Update enemies
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
            // If enemy is now dead, remove it
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
            }
        }
        this.removeDeadEntities();
    };
    EntityManager.prototype.removeDeadEntities = function () {
        // Loop through and remove all dead bullets
        for (var i = 0; i < this.player.bullets.length; i++) {
            if (!this.player.bullets[i].alive) {
                this.player.bullets.splice(i, 1);
            }
        }
        // Loop through and remove all dead enemies
    };
    /*
     *  Current spawning behaviour: all spawn points spawn a new enemy every n frames
     */
    EntityManager.prototype.spawnEnemies = function () {
        this.enemySpawnCooldown--;
        if (this.enemySpawnCooldown <= 0) {
            for (var _i = 0, _a = this.enemySpawnZones; _i < _a.length; _i++) {
                var spawnZone = _a[_i];
                this.enemies.push(new Enemy(new Point(spawnZone.position.x, spawnZone.position.y), "blue", 1, 15, new Point(), 3));
            }
            this.enemySpawnCooldown = this.enemySpawnCooldownMax;
        }
    };
    EntityManager.prototype.updatePlayerScore = function () {
        // Adds 1 to player score
        this.playerScore++;
        var scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.innerHTML = "Score: " + this.playerScore.toString();
        }
    };
    EntityManager.prototype.renderEntities = function () {
        // Bumpers
        for (var _i = 0, _a = this.circleBumpers; _i < _a.length; _i++) {
            var bumper = _a[_i];
            bumper.draw();
        }
        for (var _b = 0, _c = this.rectBumpers; _b < _c.length; _b++) {
            var bumper = _c[_b];
            bumper.draw();
        }
        // Enemy target zones
        for (var _d = 0, _e = this.enemyTargetZones; _d < _e.length; _d++) {
            var tz = _e[_d];
            tz.draw();
        }
        // Enemies 
        for (var _f = 0, _g = this.enemies; _f < _g.length; _f++) {
            var enemy = _g[_f];
            enemy.draw();
        }
        // Enemy spawn zones
        for (var _h = 0, _j = this.enemySpawnZones; _h < _j.length; _h++) {
            var spz = _j[_h];
            spz.draw();
        }
        // Player
        this.player.draw();
        // Player bullets
        for (var _k = 0, _l = this.player.bullets; _k < _l.length; _k++) {
            var bullet = _l[_k];
            bullet.draw();
        }
    };
    EntityManager.prototype.removeTargetZone = function (zoneIndex) {
        // Remove the dead tz from indices array
        for (var i = 0; i < this.enemyTargetZoneIndices.length; i++) {
            if (this.enemyTargetZoneIndices[i] === zoneIndex) {
                this.enemyTargetZoneIndices.splice(i, 1);
            }
        }
        // Check if any target zones remain
        if (this.enemyTargetZoneIndices.length === 0) {
            this.gameOver = true;
        }
        else {
            // Any enemy with the removed zone's id gets a new zone id
            for (var _i = 0, _a = this.enemies; _i < _a.length; _i++) {
                var enemy = _a[_i];
                if (enemy.targetZoneIndex === zoneIndex) {
                    enemy.setTargetZone();
                }
            }
        }
    };
    EntityManager.prototype.respawnPlayer = function () {
        this.player.die();
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
        _this.setTargetZone();
        return _this;
    }
    Enemy.prototype.setTargetZone = function () {
        // Set target zone index to nearest tz at spawn time
        var closestDistance = CanvasUtils.getInstance().getCanvas().width;
        var closestTzIndex = 0;
        // Use indices array rather than directly in tz array, in case some tzs aren't valid targets       
        for (var _i = 0, _a = EntityManager.getInstance().getEnemyTargetZoneIndices(); _i < _a.length; _i++) {
            var tzIndex = _a[_i];
            // Check distance, overwrite if lower than current closest dist value
            var distance = Point.Distance(this.position, EntityManager.getInstance().getEnemyTargetZones()[tzIndex].position);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestTzIndex = tzIndex;
            }
        }
        this.targetZoneIndex = closestTzIndex;
    };
    Enemy.prototype.update = function () {
        // Tick down impulse timer
        this.directionCooldown -= 1;
        // Check for collisions
        this.checkCollisionsWithPlayer();
        this.checkCollisionsWithBumpers();
        this.checkCollisionsWithEnemies();
        // Will set direction if under no impulse from collisions
        this.setFacingDirection();
        // Move
        _super.prototype.update.call(this);
    };
    Enemy.prototype.checkCollisionsWithPlayer = function () {
        if (this.enemyHasCollidedWithPlayer()) {
            // Respawn player
            EntityManager.getInstance().respawnPlayer();
        }
    };
    Enemy.prototype.enemyHasCollidedWithPlayer = function () {
        // Can't collide if player is dead
        if (!EntityManager.getInstance().getPlayer().alive) {
            return false;
        }
        // if player not dead, check if intersecting with this enemy
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
        var closestIndex = EntityManager.getInstance().getClosestCircleBumperIndex(this.position);
        var bumpers = EntityManager.getInstance().getCircleBumpers();
        if (Utils.CirclesIntersect(bumpers[closestIndex].position, bumpers[closestIndex].radius, this.position, this.radius)) {
            // Give impulse similar to bullet bounce
            var colNormal = Utils.getTargetDirectionNormal(bumpers[closestIndex].position, this.position);
            this.direction = Point.Reflect(this.direction, colNormal);
            this.directionCooldown = 20;
        }
    };
    Enemy.prototype.checkCollisionsWithRectBumpers = function () {
        for (var _i = 0, _a = EntityManager.getInstance().getRectBumpers(); _i < _a.length; _i++) {
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
                break;
            }
        }
    };
    Enemy.prototype.checkTargetZoneReached = function (distance) {
        var bounds = 2;
        if (this.alive && distance < bounds) {
            // reached target zone
            EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].reduceLives();
            this.alive = false;
        }
    };
    Enemy.prototype.checkCollisionsWithEnemies = function () {
        var closestIndex = EntityManager.getInstance().getClosestEnemyIndex(this.position);
        var enemies = EntityManager.getInstance().getEnemies();
        if (enemies[closestIndex]) {
            if (Utils.CirclesIntersect(enemies[closestIndex].position, enemies[closestIndex].radius, this.position, this.radius)) {
                // Give impulse similar to bullet bounce
                var colNormal = Utils.getTargetDirectionNormal(enemies[closestIndex].position, this.position);
                this.direction = Point.Reflect(this.direction, colNormal);
                this.directionCooldown = 10;
            }
        }
    };
    Enemy.prototype.setFacingDirection = function () {
        // Set direction if no impulse is currently active
        if (this.directionCooldown <= 0) {
            this.direction = this.getPriorityTargetDirectionNormal();
        }
    };
    Enemy.prototype.getPriorityTargetDirectionNormal = function () {
        // If the player is dead, head for target zone
        if (!EntityManager.getInstance().getPlayer().alive) {
            return Utils.getTargetDirectionNormal(EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].position, this.position);
        }
        // If player is alive, head for closest between player and target zone
        else {
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
        }
    };
    Enemy.prototype.takeDamage = function (damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
            EntityManager.getInstance().updatePlayerScore();
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
            if (!EntityManager.getInstance().isGameOver()) {
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
            }
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