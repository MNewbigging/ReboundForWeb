/// <reference path="entities.ts" />
/// <reference path="utils.ts" />

class Enemy extends CircleMovingEntity {
    public alive: boolean = true;
    private health: number = 100;
    // Denies changing direction in update (allows for simple impulses)
    private directionCooldown: number = 0;
    // Default targeted zone for this enemy; random index within tz list
    private targetZoneIndex: number = 0;

    update(): void {
        // Only continue if haven't hit player
        if (!this.enemyHasCollidedWithPlayer()) {
            // direction cooldown tick
            this.directionCooldown -= 1;

            // Check for bumpers
            this.checkCollisionsWithBumpers();

            // Check for other enemies
            
            // Set direction
            this.setFacingDirection();

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
        bumperLoop:
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, this.position, this.radius)) {
                // Treat this position as previous (which was outside of collision area)
                // Avoids normalising two potentially identical points for nan result
                let prevPos: Point = new Point(
                    this.position.x -= this.direction.x * this.moveSpeed,
                    this.position.y -= this.direction.y * this.moveSpeed
                );
                
                // Get collision normal
                let closestPoint: Point = Utils.getClosestPointOnRectToCircle(bumper.position, bumper.width, bumper.height, prevPos);
                let colNormal: Point = Utils.getTargetDirectionNormal(closestPoint, prevPos);

                // Reflect
                this.direction = Point.Reflect(this.direction, colNormal);
                this.directionCooldown = 20;

                // Can't collide with more than 1 bumper
                break bumperLoop;
            }
        }
    }

    private setFacingDirection(): void {
        // Set direction if no impulse is currently active
        if (this.directionCooldown <= 0) {
            this.direction = this.getPriorityTargetDirectionNormal();
        }
    }

    private getPriorityTargetDirectionNormal(): Point {
        // Compare distance to this enemy's target zone and the distance to player
        let distanceToPlayer = Point.Length(Point.Subtract(EntityManager.getInstance().getPlayer().position, this.position));
        let distanceTotz = Point.Length(Point.Subtract(EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].position,this.position));

        if (distanceToPlayer < distanceTotz) {
            // Head for player
            return Utils.getTargetDirectionNormal(EntityManager.getInstance().getPlayer().position, this.position);
        }
        else {
            // Head for target zone
            return Utils.getTargetDirectionNormal(EntityManager.getInstance().getEnemyTargetZones()[this.targetZoneIndex].position, this.position);
        }
    }

    public takeDamage(damage: number): void {
        this.health -= damage;
        if (this.health <= 0) {
            this.alive = false;
        }
    }
}