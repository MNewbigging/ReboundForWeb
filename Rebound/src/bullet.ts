/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public alive: boolean = true; // does this bullet exist
    /*
    +1 to this every rebound; damage can be multiplied rather than if(active) each frame!
    public damageMultiplier: number = 0;
    */

    constructor(px: number, py: number, dx: number, dy: number) {
        super(px, py, dx, dy, "red", 1, 20, 5);
    }

    update(): void {
        super.update();

        if (this.canvasUtils.outOfBoundsLeftOrTop(this.posX, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsLeftOrTop(this.posY, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsRight(this.posX, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsBottom(this.posY, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        
    }
}