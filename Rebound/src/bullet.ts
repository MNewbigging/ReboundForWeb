/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public alive: boolean = true; // does this bullet exist

    /*
    +1 to this every rebound; damage can be multiplied rather than if(active) each frame!
    public damageMultiplier: number = 0;
    */

    constructor(p: Point, dir: Point) {
        super(p, "red", 1, 5, dir, 12);
    }    

    update(): void {
        super.update();

        this.checkIfOutOfBounds();
        this.checkCollisionsWithBumpers();
    }
    
    private checkIfOutOfBounds(): void {
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

    private checkCollisionsWithBumpers(): void {
        this.checkCollisionsWithCircleBumpers();
        this.checkCollisionsWithRectBumpers();
    }

    private checkCollisionsWithCircleBumpers(): void {
        for (let bumper of EntityManager.getInstance().getCircleBumpers()) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, this.position, this.radius)) {
                let colNormal: Point = Utils.getTargetDirectionNormal(bumper.position, this.position);
                // Adjust bullet direction before colNorm * speed
                this.direction = Point.Reflect(this.direction, colNormal); 
                // Adjust bullet position by collision normal to prevent further collisions
                colNormal.x *= this.moveSpeed;
                colNormal.y *= this.moveSpeed;
                this.position.x -= colNormal.x;
                this.position.y -= colNormal.y;
                break;
            }
        }
    }

    private checkCollisionsWithRectBumpers(): void {
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            // Basic distance check before continuing with collision detection
            // Center point of rect bumper
            let rectCenter: Point  = new Point(
                bumper.position.x + bumper.width / 2,
                bumper.position.y + bumper.height / 2
            );
            let distance: Point = Point.Subtract(rectCenter, this.position);
            if (Point.LengthSq(distance) < 0.3 * Point.LengthSq(new Point(bumper.width, bumper.height))) {
                for (let i: number = 0; i < bumper.vertices.length; i++) {
                    if(i === 3) {
                        if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[0], this.position, this.radius)) {
                            this.adjustDirectionFromRectCollision(i);
                            break;
                        }
                    }
                    else if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[i+1], this.position, this.radius)) {
                        this.adjustDirectionFromRectCollision(i);
                        break;
                    }
                }
            break;
            }
        }
    }

    private adjustDirectionFromRectCollision(side: number): void {
        if (side === 0 || side === 2) {
            this.direction.y = -this.direction.y;
        }
        else if (side === 1 || side === 3) {
            this.direction.x = -this.direction.x;
        }
        // Move back to avoid futher collisions
        this.position.x += this.direction.x * this.moveSpeed;
        this.position.y += this.direction.y * this.moveSpeed;
    }




}