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
    private maxEnemyCount: number = 10;
    private spawnPoints: Point[];

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
        this.spawnPoints = [];
        this.setupBumpers();
        this.setupEnemies();
    }

    private setupBumpers(): void {
        let lineWidth: number = 1;
        this.circleBumpers.push(new CircleBumper(new Point(460, 320), "orange", lineWidth, 60));

        let rectWidth: number = 300;
        let rectHeight: number = 80;
        this.rectBumpers.push(new RectangleBumper(new Point(600, 280), "blue", lineWidth, rectWidth, rectHeight, "black"));
        this.rectBumpers.push(new RectangleBumper(new Point(40, 280), "blue", lineWidth, rectWidth, rectHeight, "black"));

        this.rectBumpers.push(new RectangleBumper(new Point(420, -100), "blue", lineWidth, rectHeight, rectWidth, "black"));
        this.rectBumpers.push(new RectangleBumper(new Point(420, 460), "blue", lineWidth, rectHeight, rectWidth, "black"));
    }

    private setupEnemies(): void {
        this.enemies.push(new Enemy(new Point(50, 50), "black", 1, 15, new Point(), 3));

        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;
        this.spawnPoints.push(new Point(-50, -50));
        this.spawnPoints.push(new Point(canvasWidth + 50, -50));
        this.spawnPoints.push(new Point(canvasWidth, canvasHeight + 50));
        this.spawnPoints.push(new Point(-50, canvasHeight));
        this.spawnPoints.push(new Point(canvasWidth / 2, canvasHeight + 50));
    }

    public updateEntities(): void {
        this.player.update();

        for (let enemy of this.enemies) {
            enemy.update();
        }

        this.removeDeadEnemies();
        this.spawnEnemies();
    }

    private removeDeadEnemies(): void {
        for (let i: number = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
            }
        }
    }

    private spawnEnemies(): void {
        if (this.enemies.length < this.maxEnemyCount) {
            // Get random spawn point
            this.enemies.push(new Enemy(this.spawnPoints[Utils.getRandomNumber(this.spawnPoints.length)], "black", 1, 15, new Point(), 3));
        }
        else {
            console.log("max enemies");
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