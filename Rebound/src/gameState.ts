/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />
/// <reference path= "canvasUtils.ts" />

class GameState {
    public canvasUtils: CanvasUtils;
    public keyInput: KeyboardInput;
    public player: Player;

    constructor() {
        this.canvasUtils = CanvasUtils.getInstance();
        this.keyInput = new KeyboardInput();
        this.player = new Player();
        
        this.defineInputActions();
    }

    private defineInputActions(): void {
        // Add movement functions as callbacks
        // Left arrow / a
        this.keyInput.addKeycodeCallback(37, this.player.moveLeft);
        this.keyInput.addKeycodeCallback(65, this.player.moveLeft);
        // Right arrow / d
        this.keyInput.addKeycodeCallback(39, this.player.moveRight.bind(this.player, this.canvasUtils.getCanvas().width));
        this.keyInput.addKeycodeCallback(68, this.player.moveRight.bind(this.player, this.canvasUtils.getCanvas().width));
        // Up arrow / w
        this.keyInput.addKeycodeCallback(38, this.player.moveUp);
        this.keyInput.addKeycodeCallback(87, this.player.moveUp);
        // down arrow / s
        this.keyInput.addKeycodeCallback(40, this.player.moveDown.bind(this.player, this.canvasUtils.getCanvas().height));
        this.keyInput.addKeycodeCallback(83, this.player.moveDown.bind(this.player, this.canvasUtils.getCanvas().height));
        // Fire
        this.keyInput.addKeycodeCallback(32, this.player.fireShot);
    }

    public updateAll(): void {
        // Update player
        this.player.update();

        // Update player bullets
        if (this.player.bullets.length > 0) {
            for(let bullet of this.player.bullets) {
                bullet.update();
            }
        }
    }

    public renderAll(): void {
        // Render player
        this.player.draw(this.canvasUtils.getCanvasContext());

        // Render player bullets
        if (this.player.bullets.length > 0) {
            for(let bullet of this.player.bullets) {
                bullet.draw(this.canvasUtils.getCanvasContext());
            }
        }
    }

    // Main game logic loop
    public gameLoop = (): void => {
        // Clear the canvas
        this.canvasUtils.clearCanvas();
        
        // Player input 
        this.keyInput.inputLoop();

        // Update
        this.updateAll();

        // Render
        this.renderAll();
 
        // Repeat this function to loop
        requestAnimationFrame(this.gameLoop);
    }
}




