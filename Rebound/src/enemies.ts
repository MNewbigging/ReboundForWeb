/// <reference path="entities.ts" />
/// <reference path="utils.ts" />

class Enemy extends CircleMovingEntity {
    // Denies changing direction in update (allow for simple impulses)
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
            }
        } 
    }

    private checkCollisionsWithRectBumpers(): void {
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            let rectCenter: Point  = new Point(
                bumper.position.x + bumper.width / 2,
                bumper.position.y + bumper.height / 2
            );
            let distance: Point = Point.Subtract(rectCenter, this.position);
            if (Point.LengthSq(distance) < 0.3 * Point.LengthSq(new Point(bumper.width, bumper.height))) {
                // if distance.x is positive, this is to the left of center
            }
        }
    }
}