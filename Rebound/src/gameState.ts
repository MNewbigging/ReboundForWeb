/// <reference path="player.ts" />
/// <reference path="keyboardInput.ts" />
/// <reference path= "canvasUtils.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="utils.ts" />
/// <reference path="collisionManager.ts" />

class GameState {
    public canvasUtils: CanvasUtils;
    public keyInput: KeyboardInput;
    public colMgr: CollisionManager;
    public player: Player;
    private circleBumpers: CircleBumper[];
    private rectBumpers: RectangleBumper[];

    constructor() {
        this.canvasUtils = CanvasUtils.getInstance();
        this.keyInput = new KeyboardInput();
        this.colMgr = new CollisionManager();
        this.player = new Player();
        this.circleBumpers = [];
        this.rectBumpers = [];

        this.setupBumpers();
        this.defineInputActions();
    }

    private defineInputActions(): void {
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
        // Fire
        this.keyInput.addKeycodeCallback(32, this.player.fireShot);
    }

    private setupBumpers(): void {
        this.circleBumpers.push(new CircleBumper(new Point(500, 500), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(200, 600), "orange", 5, 80));

        this.rectBumpers.push(new RectangleBumper(new Point(400, 200), "blue", 2, 200, 100, "black"));
    }

    public updateAll(): void {
        // Collision checks - bullets
        if (this.player.bullets.length > 0) {
        this.colMgr.checkBulletCollisions(this.player.bullets, this.circleBumpers);
        }
        // Collision checks - player
        this.colMgr.checkPlayerCollisions(this.player, this.circleBumpers, this.rectBumpers);

        // Update player
        this.player.update();
    }



    public renderAll(): void {
        // Render player
        this.player.draw();

        // Render player bullets
        if (this.player.bullets.length > 0) {
            for(let bullet of this.player.bullets) {
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




