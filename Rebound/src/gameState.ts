/// <reference path="keyboardInput.ts" />
/// <reference path= "canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />

class GameState {
    public canvasUtils: CanvasUtils;
    public keyInput: KeyboardInput;
    private entityMgr: EntityManager;

    constructor() {
        this.canvasUtils = CanvasUtils.getInstance();
        this.keyInput = new KeyboardInput();
        this.entityMgr = EntityManager.getInstance();

        this.defineInputActions();
    }

    private defineInputActions(): void {
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
    }

    public updateAll(): void {
        // Update player
        this.entityMgr.getPlayer().update();
    }

    public renderAll(): void {
        // Render player
        this.entityMgr.getPlayer().draw();

        // Render player bullets
        if (this.entityMgr.getPlayer().bullets.length > 0) {
            for(let bullet of this.entityMgr.getPlayer().bullets) {
                bullet.draw();
            }
        }

        // Render bumpers
        for(let bumper of this.entityMgr.getCircleBumpers()) {
            bumper.draw();
        }

        for (let bumper of this.entityMgr.getRectBumpers()) {
            bumper.draw();
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




