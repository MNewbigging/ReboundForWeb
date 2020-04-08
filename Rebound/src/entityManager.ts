/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />

class EntityManager {
    private static instance: EntityManager;
    private player: Player;
    private circleBumpers: CircleBumper[];
    private rectBumpers: RectangleBumper[];

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

    private constructor() {
        this.player = new Player();
        this.circleBumpers = [];
        this.rectBumpers = [];
        this.setupBumpers();
    }

    private setupBumpers(): void {
        this.circleBumpers.push(new CircleBumper(new Point(500, 500), "orange", 5, 40));
        this.circleBumpers.push(new CircleBumper(new Point(200, 600), "orange", 5, 80));

        this.rectBumpers.push(new RectangleBumper(new Point(500, 200), "blue", 2, 200, 100, "black"));
        this.rectBumpers.push(new RectangleBumper(new Point(200, 200), "blue", 2, 200, 100, "black"));
    }
}