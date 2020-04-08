/// <reference path="player.ts" />
/// <reference path="bumpers.ts" />

class EntityManager {
    private static instance: EntityManager;
    private player: Player;

    public static getInstance(): EntityManager {
        if (!this.instance) {
            EntityManager.instance = new EntityManager();
        }
        return EntityManager.instance;
    }

    public getPlayer(): Player {
        return this.player;
    }

    private constructor() {
        this.player = new Player();
    }
    
}