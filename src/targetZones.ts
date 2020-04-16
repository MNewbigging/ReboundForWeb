/// <reference path="entities.ts" />


class EnemyTargetZone extends CircleEntity {
    // Tracks its position in the list of zones held in entity manager
    public targetZoneId: number;
    // Tracks lives
    private maxLives: number = 5;
    public remainingLives: number;
    // Visual cue for lives remaining - the threat circle
    private threatCircleRadius: number = 0;
    private threatCircleColor: string = "red";

    constructor(id: number, p: Point, col: string, lw: number, r: number) {
        super(p, col, lw, r);
        this.targetZoneId = id;
        this.remainingLives = this.maxLives;
    }
    
    public reduceLives(): void {
        this.remainingLives -= 1;

        if (this.remainingLives <= 0) {
            this.targetZoneDestroyed();
        }
        
        // Recalculate inner circle radius
        this.recalculateThreatCircleRadius();
    }

    private targetZoneDestroyed(): void {
        // Tell the entity manager this zone is no longer a target
        EntityManager.getInstance().removeTargetZone(this.targetZoneId);
    }

    private recalculateThreatCircleRadius(): void {
        // Find inverse percentage of lives remaining vs max lives
        let percentage: number = 100 - (100 * this.remainingLives) / this.maxLives;

        // That's the percentage of total target zone radius for the threat circle
        this.threatCircleRadius = this.radius * (percentage / 100);
    }

    public draw(): void {
        super.draw();
        // Draw threat circle
        let canvasContext = CanvasUtils.getInstance().getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.threatCircleRadius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.threatCircleColor;
        canvasContext.stroke();
        canvasContext.fillStyle = this.threatCircleColor;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    }
}