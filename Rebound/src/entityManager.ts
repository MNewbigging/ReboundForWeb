/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="enemies.ts" />

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
        this.circleBumpers.push(new CircleBumper(new Point(500, 500), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(200, 600), "orange", 5, 80));

        this.rectBumpers.push(new RectangleBumper(new Point(200, 200), "blue", 2, 600, 100, "black"));
    }

    private setupEnemies(): void {
        this.enemies.push(new Enemy(new Point(50, 50), "black", 1, 15, new Point(), 3));
    }

}