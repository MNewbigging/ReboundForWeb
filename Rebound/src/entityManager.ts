/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />
/// <reference path="canvasUtils.ts" />


class EntityManager {
    private static instance: EntityManager;
    private player: Player;
    private circleBumpers: CircleBumper[];
    private rectBumpers: RectangleBumper[];
    private enemies: Enemy[];


    public static getInstance(): EntityManager {
        if (!this.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public getCircleBumpers(): CircleBumper[] {
        return this.circleBumpers;
    }

    public getRectBumpers(): RectangleBumper[] {
        return this.rectBumpers;
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    private constructor() {
        this.player = new Player();
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.enemies = [];
        this.setupBumpers();
        this.setupEnemies();
    }

    private setupBumpers(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        // Rectangle Bumpers
        let rectWidth: number = canvasWidth * 0.6;
        let rectHeight: number = canvasHeight * 0.1;
        let lineWidth: number = 1;
        this.rectBumpers.push(new RectangleBumper(new Point(
            canvasWidth * 0.2, canvasHeight * 0.35 
        ), "black", lineWidth, rectWidth, rectHeight, "black"));
        
        // Circle Bumpers
        let circleBumperRadius: number = 40;
        this.circleBumpers.push(new CircleBumper(new Point(
            canvasWidth * 0.1, canvasHeight * 0.2
        ), "orange", lineWidth, circleBumperRadius));

        this.circleBumpers.push(new CircleBumper(new Point(
            canvasWidth * 0.9, canvasHeight * 0.2
        ), "orange", lineWidth, circleBumperRadius));
    }

    private setupEnemies(): void {
        this.enemies.push(new Enemy(new Point(50, 50), "black", 1, 15, new Point(), 3));

        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;
    }

    public updateEntities(): void {
        this.player.update();

        for (let enemy of this.enemies) {
            enemy.update();
        }

        this.removeDeadEnemies();
        //this.spawnEnemies();
    }

    private removeDeadEnemies(): void {
        for (let i: number = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
            }
        }
    }

    public renderEntities(): void {
        // Player
        this.player.draw();
        // Player bullets
        if (this.player.bullets.length > 0) {
            for (let bullet of this.player.bullets) {
                bullet.draw();
            }
        }
        // Bumpers
        for (let bumper of this.circleBumpers) {
            bumper.draw();
        }
        for (let bumper of this.rectBumpers) {
            bumper.draw();
        }
        // Enemies
        if (this.enemies.length > 0) {
            for (let enemy of this.enemies) {
                enemy.draw();
            }
        }
    }
}