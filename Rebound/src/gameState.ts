/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />
/// <reference path= "canvasUtils.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="utils.ts" />
/// <reference path="collisionManager.ts" />
/// <reference path="entityManager.ts" />

class GameState {
    public canvasUtils: CanvasUtils;
    public keyInput: KeyboardInput;
    public colMgr: CollisionManager;
    private entityMgr: EntityManager;
    private circleBumpers: CircleBumper[];
    private rectBumpers: RectangleBumper[];

    constructor() {
        this.canvasUtils = CanvasUtils.getInstance();
        this.keyInput = new KeyboardInput();
        this.colMgr = new CollisionManager();
        this.entityMgr = EntityManager.getInstance();
        this.circleBumpers = [];
        this.rectBumpers = [];

        this.setupBumpers();
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

    private setupBumpers(): void {
        this.circleBumpers.push(new CircleBumper(new Point(500, 500), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(200, 600), "orange", 5, 80));

        this.rectBumpers.push(new RectangleBumper(new Point(400, 200), "blue", 2, 200, 100, "black"));
    }

    public updateAll(): void {
        // Collision checks - bullets
        if (this.entityMgr.getPlayer().bullets.length > 0) {
        this.colMgr.checkBulletCollisions(this.entityMgr.getPlayer().bullets, this.circleBumpers);
        }
        // Collision checks - player
        this.colMgr.checkPlayerCollisions(this.entityMgr.getPlayer(), this.circleBumpers, this.rectBumpers);

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
        for(let bumper of this.circleBumpers) {
            bumper.draw();
        }

        for (let bumper of this.rectBumpers) {
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




