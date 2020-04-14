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

    private setupTargetZones(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        let maxTargetZones: number = 2;
        let zonesInterval: number = canvasWidth / maxTargetZones;
        for (let i: number = 0; i < maxTargetZones; i++) {
            // Create the target zone
            this.enemyTargetZones.push(new EnemyTargetZone(i, new Point(
                100 + i * zonesInterval, canvasHeight * 0.8
            ), "purple", 1, 30));
            // Add tz id to array
            this.enemyTargetZoneIndices.push(i);
        }
    }

    private setupEnemies(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        let enemyCount: number = 5;
        let intervalX: number = canvasWidth / enemyCount; 
        for (let i: number = 0; i < enemyCount; i++) {
            this.enemies.push(new Enemy(new Point(
                50 + i * intervalX, canvasHeight * 0.1
            ), "black", 1, 15, new Point(), 3));
            this.enemies[i].setTargetZone(this.enemyTargetZones, this.enemyTargetZoneIndices);
        }

        console.log(`enemies: ${this.enemies.length}`);
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
        // Doesn't get destroyed, still want to render it
        // Just prevent enemies from targeting it
        

        // Any enemy with the removed zone's id gets a new zone id

    }

}