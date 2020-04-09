/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public outOfBounds: boolean = false; 
    public damageMultiplier: number = 0;
    public damage: number = 100;
    private reboundRadiusGrowthStep: number = 1;
    

    constructor(p: Point, dir: Point) {
        super(p, "grey", 1, 5, dir, 12);
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
                break;
            }
        }
    }

    private checkCollisionsWithRectBumpers(): void {
        bumperLoop:
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
                for (let i: number = 0; i < bumper.vertices.length; i++) {
                    if(i === 3) {
                        if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[0], this.position, this.radius)) {
                            this.adjustDirectionFromRectCollision(i, bumper);
                            break bumperLoop;
                        }
                    }
                    else if (Utils.CircleToLineIntersect(bumper.vertices[i], bumper.vertices[i+1], this.position, this.radius)) {
                        this.adjustDirectionFromRectCollision(i, bumper);
                        break bumperLoop;
                    }
                }
            }
        }
    }

    private adjustDirectionFromRectCollision(side: number, bumper: RectangleBumper): void {
        if (side === 0 || side === 2) {
            this.direction.y = -this.direction.y;
        }
        else if (side === 1 || side === 3) {
            this.direction.x = -this.direction.x;
        }
        // Move back to avoid futher collisions
        this.position.x += this.direction.x * this.moveSpeed;
        this.position.y += this.direction.y * this.moveSpeed;



        // Apply other rebound effects
        this.applyReboundEffects();
    }

    private applyReboundEffects(): void {
        this.damageMultiplier += 1;
        this.radius += this.reboundRadiusGrowthStep;
        this.color = "red";
    }

    private checkCollisionWithEnemies(): void {
        // Only run checks for enemies if we have a damage greater than 0!
        if (this.damageMultiplier > 0) {
            for (let enemy of EntityManager.getInstance().getEnemies()) {
                if (Utils.CirclesIntersect(enemy.position, enemy.radius, this.position, this.radius)) {
                    // Damage the enemy
                    enemy.takeDamage(this.damage * this.damageMultiplier);
                    // Remove this bullet
                    this.outOfBounds = true;
                    break;
                }
            }
        }
    }




}