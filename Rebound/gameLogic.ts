
// Global vars
var gState: Gamestate;
var canvasContext: CanvasRenderingContext2D;
var canvasWidth: number;
var canvasHeight: number;


class Player {
    // circle representing player
    public shape: Circle;
    // Move vars
    public moveSpeed: number;

    constructor() {
        this.shape = new Circle(0.5 * canvasWidth, 0.8 * canvasHeight, 20, "green");
        this.moveSpeed = 3;
    }

    public moveLeft = (): void => {
        // Ensure player doesn't leave canvas
        if (this.shape.x > this.moveSpeed + this.shape.radius) {
            this.shape.x -= this.moveSpeed;
        }    
    }

    public moveRight = (): void => {
        if (this.shape.x < canvasWidth - this.moveSpeed - this.shape.radius) {
            this.shape.x += this.moveSpeed;
        }
     
    }

    public moveUp = (): void => {
        if (this.shape.y > this.moveSpeed + this.shape.radius) {
            this.shape.y -= this.moveSpeed;
        }   
    }

    public moveDown = (): void => {
        if (this.shape.y < canvasHeight - this.moveSpeed - this.shape.radius) {
            this.shape.y += this.moveSpeed;
        }
        
    }
}

class KeyboardInput {
    // Dictionary that maps key code number to function
    public keyCallback: { [keycode: number]: () => void; } = {};
    // Dictionary that tracks which keys are pressed/released
    public keyDown: { [keycode: number] : boolean; } = {};

    constructor() {
        document.addEventListener('keydown', this.keyboardDown);
        document.addEventListener('keyup', this.keyboardUp);
    }

    public addKeycodeCallback = (keycode: number, f: () => void): void => {
        this.keyCallback[keycode] = f;
        this.keyDown[keycode] = false;
    }

    public keyboardDown = (event: KeyboardEvent): void => {
        event.preventDefault();
        this.keyDown[event.keyCode] = true;
    }

    public keyboardUp = (event: KeyboardEvent): void => {
        this.keyDown[event.keyCode] = false;
    }

    public inputLoop = (): void => {
        // Loop through all values in dictionary
        for (var key in this.keyDown) {
            var is_down: boolean = this.keyDown[key];
            // If pressed
            if (is_down) {
                // Grab function for that key press
                var callback: () => void = this.keyCallback[key];
                if (callback != null) {
                    // Perform that function
                    callback();
                }
            }
        }
    }
}

class Gamestate {
    
    // Player
    public player: Player;
    // Player input
    public keyInput: KeyboardInput;

    // List of enemies
    public enemies: Circle[];

    constructor() {
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

    // Check for collisions between player and others
    public checkCollisions = (): void => {

    }


    // Initial setup
    public gameInit = (): void => {
        // Create an enemy
        this.enemies[0] = new Circle(0.5 * canvasWidth, 0.5 * canvasHeight, 10);
    }

    // Main game logic loop
    public gameLoop = (): void => {
        // Clear the canvas
        canvasContext.clearRect(0,0, canvasWidth, canvasHeight);

        // Player input 
        this.keyInput.inputLoop();

        // Update positions

        // Check for collisions

        // Render
        // Player
        this.player.shape.draw();
        // Enemies
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[0].draw();
        }
    }

    

}

interface iShape {
    draw() : void;
    x: number;
    y: number;
    color: string;
    lineWidth: number;
}

class Circle implements iShape {
    public x: number = 0;
    public y: number = 0;
    public radius: number = 10;
    public lineWidth: number = 2;
    public color: string = "red";

    constructor(x: number, y: number, radius: number, color: string = "red", lineWidth: number = 2) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lineWidth = lineWidth;
    }
    
    public draw = (): void => {
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    }

}




// Setup function runs on window load
window.onload = () => {

    // Setup canvas vars
    var canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
    canvasContext = canvas.getContext("2d");
    canvasWidth = 800;
    canvasHeight = 600;

    // Create new gamestate object
    gState = new Gamestate();

    // Perform game setup/restart
    gState.gameInit();

    // Run main game loop
    setInterval(gState.gameLoop, 10);
}



