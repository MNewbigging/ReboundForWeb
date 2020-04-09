/// <reference path="entities.ts" />

class EnemyTargetZone extends CircleEntity {
    // Remaining lives
    public remainingLives: number = 1;
    
    public reduceLives(): void {
        this.remainingLives -= 1;
        if (this.remainingLives <= 0) {
            this.gameOver();
        }
    }

    private gameOver(): void {
        console.log("you lost!");
    }
}