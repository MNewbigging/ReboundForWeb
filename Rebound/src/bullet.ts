/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public outOfBounds: boolean = false; 
    private damageMultiplier: number = 0;
    private damage: number = 100;
    
    constructor(p: Point, dir: Point) {
        super(p, "grey", 1, 5, dir, 8);
    }    

    update(): void {
        super.update();

        this.checkIfOutOfBounds();
        this.checkCollisions();
    }
    
    private checkIfOutOfBounds(): void {
        if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.x, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
        else if (this.canvasUtils.outOfBoundsLeftOrTop(this.position.y, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
        else if (this.canvasUtils.outOfBoundsRight(this.position.x, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
        else if (this.canvasUtils.outOfBoundsBottom(this.position.y, this.moveSpeed, this.radius)) {
            this.outOfBounds = true;
        }
    }

    private checkCollisions(): void {
        this.checkCollisionsWithCircleBumpers();
        this.checkCollisionsWithRectBumpers();
        this.checkCollisionWithEnemies();
    }

    private checkCollisionsWithCircleBumpers(): void {
        for (let bumper of EntityManager.getInstance().getCircleBumpers()) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, this.position, this.radius)) {
                // Get collision normal
                let colNormal: Point = Utils.getTargetDirectionNormal(bumper.position, this.position);

                // Adjust bullet direction before colNorm * speed
                this.direction = Point.Reflect(this.direction, colNormal); 

                // Adjust bullet position by collision normal to prevent further collisions
                colNormal.x *= this.moveSpeed;
                colNormal.y *= this.moveSpeed;
                this.position.x -= colNormal.x;
                this.position.y -= colNormal.y;

                // Apply any other effects on rebound
                this.applyReboundEffects();

                // Can't hit more than one bumper
                break;
            }
        }
    }

    private checkCollisionsWithRectBumpers(): void {
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
                // Treat this position as previous (which was outside of collision area)
                let prevPos: Point = new Point(
                    this.position.x -= this.direction.x * this.moveSpeed,
                    this.position.y -= this.direction.y * this.moveSpeed
                ); 

                // Get collision normal
                let closestPoint: Point = Utils.getClosestPointOnRectToCircle(bumper.position, bumper.width, bumper.height, prevPos);
                let colNormal: Point = Utils.getTargetDirectionNormal(closestPoint, prevPos);
                
                // Reflect
                this.direction = Point.Reflect(this.direction, colNormal);

                // Apply other rebound effects
                this.applyReboundEffects();

                // Can't hit more than one bumper at once, break
                break;
            }
        }
    }

    private applyReboundEffects(): void {
        this.damageMultiplier += 1;
        // TODO - increase bullet radius on hit. Need to move out of collision area by how far bullet penetrates collider to work
        this.color = "red";
    }

    private checkCollisionWithEnemies(): void {
        // Only run checks for enemies if we have a damage greater than 0!
        if (this.damageMultiplier > 0) {
            for (let enemy of EntityManager.getInstance().getEnemies()) {
                if (Utils.CirclesIntersect(enemy.position, enemy.radius, this.position, this.radius)) {
                    // Damage the enemy
                    enemy.takeDamage(this.damage * this.damageMultiplier);
                    // Mark bullet for removal
                    this.outOfBounds = true;
                    break;
                }
            }
        }
    }
}