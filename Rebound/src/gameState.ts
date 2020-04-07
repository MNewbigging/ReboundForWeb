/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />

class GameState {
    public player: Player;
    public keyInput: KeyboardInput;
    // Any isn't nice, can't have it un-initialised or potentially null
    public canvas: any;
    public canvasContext: any;

    constructor() {
        let cvs = <HTMLCanvasElement>document.getElementById("game-canvas");
        if (cvs instanceof HTMLCanvasElement) {
            this.canvas = cvs;
        }

        let ctx = this.canvas.getContext("2d");
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
    }

    public resize() {
        let canvasWrapper = document.getElementById("game-container");
        if (this.canvas && canvasWrapper) {
            let wrapperBounds = canvasWrapper.getBoundingClientRect();
            this.canvas.width = wrapperBounds.width;
            this.canvas.height = wrapperBounds.height;
            console.log(`canvas w: ${this.canvas.width}`);
        }
    }

    // Main game logic loop
    public gameLoop = (): void => {
        // Clear the canvas
        this.canvasContext.clearRect(0,0, this.canvas.width, this.canvas.height);

        // Player input 
        this.keyInput.inputLoop();

        // Render
        // Player
        this.player.shape.draw(this.canvasContext);
    }
}




