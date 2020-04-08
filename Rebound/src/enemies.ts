/// <reference path="entities.ts" />
/// <reference path="utils.ts" />

class Enemy extends CircleMovingEntity {
    public alive: boolean = true;
    private health: number = 100;
    // Denies changing direction in update (allows for simple impulses)
    private directionCooldown: number = 0;

    update(): void {
        // Only continue if haven't hit player
        if (!this.enemyHasCollidedWithPlayer()) {
            // direction cooldown tick
            this.directionCooldown -= 1;

            // Check for bumpers
            this.checkCollisionsWithBumpers();
            
            
            // Move towards player if allowed
            if (this.directionCooldown <= 0) {
                let playerToEnemy: Point = Point.Subtract(EntityManager.getInstance().getPlayer().position, this.position);
                this.direction = Point.Normalize(playerToEnemy);
            }

            // Move
            super.update();
        }
        // Player has been hit
        else {
            // Damage player
            
        }
    }

    private enemyHasCollidedWithPlayer(): boolean {
        if (Utils.CirclesIntersect(EntityManager.getInstance().getPlayer().position, EntityManager.getInstance().getPlayer().radius, this.position, this.radius)) {
            return true;
        }
        return false;
    }

    private checkCollisionsWithBumpers(): void {
        this.checkCollisionsWithCircleBumpers();
        this.checkCollisionsWithRectBumpers();
    }

    private checkCollisionsWithCircleBumpers(): void {
        for (let bumper of EntityManager.getInstance().getCircleBumpers()) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, this.position, this.radius)) {  
                // Give impulse similar to bullet bounce
                let colNormal: Point = Utils.getTargetDirectionNormal(bumper.position, this.position);
                this.direction = Point.Reflect(this.direction, colNormal);
                this.directionCooldown = 20;
                break;
            }
        } 
    }

    private checkCollisionsWithRectBumpers(): void {
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
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
                this.directionCooldown = 20;
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

    public takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
        }
    }
}