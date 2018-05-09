// Global vars
var gState;
var canvasContext;
var canvasWidth;
var canvasHeight;
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
            if (_this.shape.x < canvasWidth - _this.moveSpeed - _this.shape.radius) {
                _this.shape.x += _this.moveSpeed;
            }
        };
        this.moveUp = function () {
            if (_this.shape.y > _this.moveSpeed + _this.shape.radius) {
                _this.shape.y -= _this.moveSpeed;
            }
        };
        this.moveDown = function () {
            if (_this.shape.y < canvasHeight - _this.moveSpeed - _this.shape.radius) {
                _this.shape.y += _this.moveSpeed;
            }
        };
        this.shape = new Circle(0.5 * canvasWidth, 0.8 * canvasHeight, 20, "green");
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
            _this.keyDown[keycode] = false;
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
var Gamestate = /** @class */ (function () {
    function Gamestate() {
        var _this = this;
        // Check for collisions between player and others
        this.checkCollisions = function () {
        };
        // Initial setup
        this.gameInit = function () {
            // Create an enemy
            _this.enemies[0] = new Circle(0.5 * canvasWidth, 0.5 * canvasHeight, 10);
        };
        // Main game logic loop
        this.gameLoop = function () {
            // Clear the canvas
            canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            // Player input 
            _this.keyInput.inputLoop();
            // Update positions
            // Check for collisions
            // Render
            // Player
            _this.player.shape.draw();
            // Enemies
            for (var i = 0; i < _this.enemies.length; i++) {
                _this.enemies[0].draw();
            }
        };
        this.enemies = [];
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
var Circle = /** @class */ (function () {
    function Circle(x, y, radius, color, lineWidth) {
        if (color === void 0) { color = "red"; }
        if (lineWidth === void 0) { lineWidth = 2; }
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.radius = 10;
        this.lineWidth = 2;
        this.color = "red";
        this.draw = function () {
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
// Setup function runs on window load
window.onload = function () {
    // Setup canvas vars
    var canvas = document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    canvasWidth = 800;
    canvasHeight = 600;
    // Create new gamestate object
    gState = new Gamestate();
    // Perform game setup/restart
    gState.gameInit();
    // Run main game loop
    setInterval(gState.gameLoop, 10);
};
//# sourceMappingURL=gameLogic.js.map