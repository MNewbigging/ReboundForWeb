/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />

class GameState {
    public player: Player;
    public keyInput: KeyboardInput;
    public canvas: HTMLCanvasElement;
    // Any isn't nice, but can't have CanvasRenderingContext2d as null/un-initialised in same fashion 
    public canvasContext: any;

    constructor(cnvs: HTMLCanvasElement) {
        this.canvas = cnvs;
        let ctx = this.canvas.getContext("2d");
        if (ctx instanceof CanvasRenderingContext2D) {
            this.canvasContext = ctx;
        }
        else {
            // Couldn't get canvas context; can't draw, stop here
            console.log("ERROR: can't get canvas context");
        }

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




