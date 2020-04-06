/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />

class Gamestate {
    public player: Player;
    public keyInput: KeyboardInput;
    public canvasCtx: CanvasRenderingContext2D;
    public canvasW: number;
    public canvasH: number;

    constructor(cnvCtx: CanvasRenderingContext2D, cnvW: number, cnvH: number) {
        this.canvasCtx = cnvCtx;
        this.canvasW = cnvW;
        this.canvasH = cnvH;
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

    // Main game logic loop
    public gameLoop = (): void => {
        // Clear the canvas
        this.canvasCtx.clearRect(0,0, this.canvasW, this.canvasH);

        // Player input 
        this.keyInput.inputLoop();

        // Update positions

        // Check for collisions

        // Render
        // Player
        this.player.shape.draw(this.canvasCtx);
    }
}




