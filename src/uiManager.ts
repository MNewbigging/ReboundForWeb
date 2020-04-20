class UiManager {
    private static instance: UiManager;

    public static getInstance(): UiManager {
        if (!this.instance) {
            UiManager.instance = new UiManager();
        }
        return UiManager.instance;
    }

    private constructor() {}

    public updatePlayerScore(score: number): void {
        let scoreElement = document.getElementById("score");
        if (scoreElement) {
            scoreElement.innerHTML = `Score: ${score.toString()}`;
        }
    }

    public playerDeadMessage(): void {
        // Update UI element to show we are respawning
        let respawnElement = document.getElementById("respawn");
        if (respawnElement) {
            respawnElement.innerHTML = "Systems Repairing...";
        }
    }

    public playerRespawnMessage(): void {
        // Update UI element to show we have respawned
        let respawnElement = document.getElementById("respawn");
        if (respawnElement) {
            respawnElement.innerHTML = "Systems Online";
        }
    }
}