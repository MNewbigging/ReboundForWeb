/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="targetZones.ts" />
/// <reference path="spawnZones.ts" />
/// <reference path="uiManager.ts" />


class EntityManager {
    private static instance: EntityManager;
    private player: Player;
    private circleBumpers: CircleBumper[];
    private rectBumpers: RectangleBumper[];
    // TODO - move enemy stuff to separate manager class
    private enemies: Enemy[];
    private enemySpawnZones: EnemySpawnZone[];
    private enemyTargetZones: EnemyTargetZone[];
    private enemyTargetZoneIndices: number[];
    private enemySpawnCooldownMax: number = 300;
    private enemySpawnCooldown: number = 0;
    private gameOver: boolean = false;
    private playerScore: number;

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

    public getClosestCircleBumperIndex(position: Point): number {
        let closestIndex: number = -1; 
        let closestDistanceSq: number = Infinity;
        for (let i: number = 0; i < this.circleBumpers.length; i++) {
            let distanceSq: number = Point.LengthSq(Point.Subtract(this.circleBumpers[i].position, position));
            if (distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                closestIndex = i;
            }
        }
        return closestIndex;
    }

    public getRectBumpers(): RectangleBumper[] {
        return this.rectBumpers;
    }

    public getEnemies(): Enemy[] {
        return this.enemies;
    }

    public getClosestEnemyIndex(position: Point): number {
        let closestIndex: number = -1; 
        let closestDistanceSq: number = Infinity;
        for (let i: number = 0; i < this.enemies.length; i++) {
            let distanceSq: number = Point.LengthSq(Point.Subtract(this.enemies[i].position, position));
            if (distanceSq > 0 && distanceSq < closestDistanceSq) {
                closestDistanceSq = distanceSq;
                closestIndex = i;
            }
        }
        return closestIndex;
    }

    public getEnemyTargetZones(): EnemyTargetZone[] {
        return this.enemyTargetZones;
    }

    public getEnemyTargetZoneIndices(): number[] {
        return this.enemyTargetZoneIndices;
    }

    public isGameOver(): boolean {
        return this.gameOver;
    }

    private constructor() {  
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.enemies = [];
        this.enemySpawnZones = [];
        this.enemyTargetZones = [];
        this.enemyTargetZoneIndices = [];
        this.playerScore = 0;

        this.setupBumpers();
        this.setupTargetZones();
        this.setupEnemySpawnZones();

        let playerPos: Point = new Point(CanvasUtils.getInstance().getCanvas().width * 0.5, CanvasUtils.getInstance().getCanvas().height * 0.8);
        this.player = new Player(playerPos);
    }

    private setupBumpers(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        // Center rectangle
        let rectColor: string = "black";
        let rectWidth: number = 30;
        let rectHeight: number = 150;
        let rectXpos: number = canvasWidth * 0.5 - rectWidth * 0.5;
        let rectYpos: number = canvasHeight * 0.5 - rectHeight * 0.5;
        this.rectBumpers.push(new RectangleBumper(new Point(rectXpos, rectYpos), rectColor, 1, rectWidth, rectHeight, rectColor));

        // Top left corner rectangles
        let side: number = 60;
        this.rectBumpers.push(new RectangleBumper(new Point
            (canvasWidth * 0.2 - side * 0.5, canvasHeight * 0.3 - side * 0.5),
            rectColor, 1, side * 4, side, rectColor));

        // Top right corner rectangle
        this.rectBumpers.push(new RectangleBumper(new Point
            (canvasWidth * 0.8 - side * 4 + side * 0.5, canvasHeight * 0.3 - side * 0.5),
            rectColor, 1, side * 4, side, rectColor));

        // Bot right corner rectangle
        this.rectBumpers.push(new RectangleBumper(new Point
            (canvasWidth * 0.8 - side * 4 + side * 0.5, canvasHeight * 0.7 - side * 0.5),
            rectColor, 1, side * 4, side, rectColor));

        // Bot left corner rectangle
        this.rectBumpers.push(new RectangleBumper(new Point
            (canvasWidth * 0.2 - side * 0.5, canvasHeight * 0.7 - side * 0.5),
            rectColor, 1, side * 4, side, rectColor));

        // Bumpers above/below target zones
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.4, canvasHeight * 0.3), "orange", 1, 20));
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.6, canvasHeight * 0.3), "orange", 1, 20));
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.4, canvasHeight * 0.7), "orange", 1, 20));
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.6, canvasHeight * 0.7), "orange", 1, 20));

        // Bumpers on edges
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.1, canvasHeight * 0.5), "orange", 1, 50));
        this.circleBumpers.push(new CircleBumper(new Point(canvasWidth * 0.9, canvasHeight * 0.5), "orange", 1, 50));
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

        // Left tz
        this.enemyTargetZones.push(new EnemyTargetZone(0, new Point(
            canvasWidth * 0.4, canvasHeight * 0.5
        ), "purple", 1, 30));

        // Right tz
        this.enemyTargetZones.push(new EnemyTargetZone(1, new Point(
            canvasWidth * 0.6, canvasHeight * 0.5
        ), "purple", 1, 30));

        this.enemyTargetZoneIndices.push(0);
        this.enemyTargetZoneIndices.push(1);
    }

    private setupEnemySpawnZones(): void {
        let canvasWidth: number = CanvasUtils.getInstance().getCanvas().width;
        let canvasHeight: number = CanvasUtils.getInstance().getCanvas().height;

        let spawnZoneA: Point = new Point(canvasWidth * 0.025, canvasHeight * 0.49);
        let spawnZoneB: Point = new Point(canvasWidth * 0.975, canvasHeight * 0.51);

        this.enemySpawnZones.push(new EnemySpawnZone(spawnZoneA, "yellow", 1, 20));
        this.enemySpawnZones.push(new EnemySpawnZone(spawnZoneB, "yellow", 1, 20));
    }

    public updateEntities(): void {
        // Updating player also updates all bullets
        this.player.update();

        this.spawnEnemies();

        // Update enemies
        for(let enemy of this.enemies) {
            enemy.update();
        }

        this.removeDeadEntities();
    }

    private removeDeadEntities(): void {
        // Loop through and remove all dead bullets
        for (let i: number = 0; i < this.player.bullets.length; i++) {
            if (!this.player.bullets[i].alive) {
                this.player.bullets.splice(i, 1);
            }
        }

        // Loop through and remove all dead enemies
        for (let i: number = 0; i < this.enemies.length; i++) {
            if (!this.enemies[i].alive) {
                this.enemies.splice(i, 1);
            }
        }
    }

    /*
     *  Current spawning behaviour: all spawn points spawn a new enemy every n frames
     */
    private spawnEnemies(): void {
        this.enemySpawnCooldown--;
        if (this.enemySpawnCooldown <= 0) {
            for (let spawnZone of this.enemySpawnZones) {
                this.enemies.push(new Enemy(new Point(spawnZone.position.x, spawnZone.position.y), "blue", 1, 15, new Point(), 3));
            }
            this.enemySpawnCooldown = this.enemySpawnCooldownMax;
        }
    }

    public updatePlayerScore(): void {
        // Adds 1 to player score
        this.playerScore++;
        UiManager.getInstance().updatePlayerScore(this.playerScore);
    }

    public renderEntities(): void {
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
        for (let enemy of this.enemies) {
            enemy.draw();
        }
        
        // Enemy spawn zones
        for (let spz of this.enemySpawnZones) {
            spz.draw();
        }

        // Player
        this.player.draw();

        // Player bullets
        for (let bullet of this.player.bullets) {
            bullet.draw();
        }
        
    }

    public removeTargetZone(zoneIndex: number): void {
        // Remove the dead tz from indices array
        for (let i: number = 0; i < this.enemyTargetZoneIndices.length; i++) {
            if (this.enemyTargetZoneIndices[i] === zoneIndex) {
                this.enemyTargetZoneIndices.splice(i, 1);
            }
        }

        // Check if any target zones remain
        if (this.enemyTargetZoneIndices.length === 0) {
            this.gameOver = true;
            UiManager.getInstance().gameOverMessage();
        }
        else {
            // Any enemy with the removed zone's id gets a new zone id
            for (let enemy of this.enemies) {
                if (enemy.targetZoneIndex === zoneIndex) {
                    enemy.setTargetZone();
                }
            }
        }
    }

    public respawnPlayer(): void {
        this.player.die();
    }
}