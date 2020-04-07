/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public alive: boolean = true; // does this bullet exist

    /*
    +1 to this every rebound; damage can be multiplied rather than if(active) each frame!
    public damageMultiplier: number = 0;
    */

    constructor(p: Point, dir: Point) {
        super(p, "red", 1, 5, dir, 10);
    }    

    update(): void {
        super.update();

        if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.x, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.y, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsRight(this.position.x, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        else if (this.canvasUtils.outOfBoundsBottom(this.position.y, this.moveSpeed, this.radius)) {
            this.alive = false;
        }
        
    }
}