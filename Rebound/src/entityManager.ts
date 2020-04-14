/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="targetZones.ts" />


class EntityManager {
    private static instance: EntityManager;
    private player: Player;
    private circleBumpers: CircleBumper[];
    private rectBumpers: RectangleBumper[];
    private enemies: Enemy[];
    private enemyTargetZones: EnemyTargetZone[];
    private enemyTargetZoneIndices: number[];

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

    public getEnemyTargetZones(): EnemyTargetZone[] {
        return this.enemyTargetZones;
    }

    public getEnemyTargetZoneIndices(): number[] {
        return this.enemyTargetZoneIndices;
    }

    private constructor() {  
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.enemies = [];
        this.enemyTargetZones = [];
        this.enemyTargetZoneIndices = [];

        this.setupBumpers();
        this.setupTargetZones();
        this.setupEnemies();

        this.player = new Player();
    }

    private setupBumpers(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;
        this.addBumperSet(canvasWidth * 0.2, canvasHeight * 0.5);
        this.addBumperSet(canvasWidth * 0.8, canvasHeight * 0.5);

        console.log(`${canvasHeight}`);
        // Top bumper
        this.rectBumpers.push(new RectangleBumper(new Point(canvasWidth * 0.25, 0), "black", 1, canvasWidth * 0.5, 30, "black"));
        // Bot bumper
        this.rectBumpers.push(new RectangleBumper(new Point(canvasWidth * 0.25, canvasHeight - 30), "black", 1, canvasWidth * 0.5, 30, "black"));
        // Centre circle bumper
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.5, canvasHeight * 0.4), "orange", 1, 40));
    }

    // Adds preset bumper layout; circle with 4 squares outside on each axis
    private addBumperSet(centerX: number, centerY: number): void {
        let lineWidth: number = 1;
        let circleRadius: number = 30;
        let halfRadius: number = circleRadius * 0.5;
        let squareSide: number = 50;
        let halfSquareSide: number = squareSide * 0.5;
        let gap: number = 60;
        let rectColor: string = "black";

        // Center circle bumper
        this.circleBumpers.push(new CircleBumper(new Point(centerX, centerY), "orange", lineWidth, circleRadius));

        // Left rect
        this.rectBumpers.push(new RectangleBumper(new Point(
            centerX - halfRadius - gap - squareSide, centerY - halfSquareSide),
            rectColor, lineWidth, squareSide, squareSide, rectColor));

        // Right rect
        this.rectBumpers.push(new RectangleBumper(new Point(
            centerX + halfRadius + gap, centerY - halfSquareSide),
            rectColor, lineWidth, squareSide, squareSide, rectColor));

        // Top rect
        this.rectBumpers.push(new RectangleBumper(new Point(
            centerX - halfSquareSide, centerY - halfRadius - gap - squareSide),
            rectColor, lineWidth, squareSide, squareSide, rectColor));

        // Bot rect
        this.rectBumpers.push(new RectangleBumper(new Point(
            centerX - halfSquareSide, centerY + halfRadius + gap),
            rectColor, lineWidth, squareSide, squareSide, rectColor));
    }

    private setupTargetZones(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        // Bottom left corner tz
        this.enemyTargetZones.push(new EnemyTargetZone(0, new Point(
            canvasWidth * 0.2, canvasHeight * 0.8
        ), "purple", 1, 30));

        // Bottom right corner tz
        this.enemyTargetZones.push(new EnemyTargetZone(0, new Point(
            canvasWidth * 0.8, canvasHeight * 0.8
        ), "purple", 1, 30));

        this.enemyTargetZoneIndices.push(0);
        this.enemyTargetZoneIndices.push(1);
    }

    private setupEnemies(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        let enemyCount: number = 2;
        let intervalX: number = canvasWidth / enemyCount; 
        for (let i: number = 0; i < enemyCount; i++) {
            this.enemies.push(new Enemy(new Point(
                50 + i, canvasHeight * 0.1
            ), "black", 1, 15, new Point(), 3));
            this.enemies[i].setTargetZone(this.enemyTargetZones, this.enemyTargetZoneIndices);
        }
    }

    public updateEntities(): void {
        this.player.update();

        for (let enemy of this.enemies) {
            enemy.update();
        }

        this.removeDeadEnemies();
    }

    private removeDeadEnemies(): void {
        // TODO - move this so it isn't called in update
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
        // Enemy target zones
        for (let tz of this.enemyTargetZones) {
            tz.draw();
        }

        // Enemies
        if (this.enemies.length > 0) {
            for (let enemy of this.enemies) {
                enemy.draw();
            }
        }
    }

    public removeTargetZone(zoneIndex: number): void {
        // Remove the dead tz from indices array
        for (let i: number = 0; i < this.enemyTargetZoneIndices.length; i++) {
            if (this.enemyTargetZoneIndices[i] === zoneIndex) {
                this.enemyTargetZoneIndices.splice(i, 1);
            }
        }

        // Any enemy with the removed zone's id gets a new zone id
        for (let enemy of this.enemies) {
            if (enemy.targetZoneIndex === zoneIndex) {
                enemy.setTargetZone(this.enemyTargetZones, this.enemyTargetZoneIndices);
            }
        }
    }

}