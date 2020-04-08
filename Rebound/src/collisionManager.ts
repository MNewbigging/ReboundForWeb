/// <reference path="bullet.ts" />
/// <reference path="bumpers.ts" />
/// <reference path="utils.ts" />
/// <reference path="player.ts" />

class CollisionManager {
    public checkBulletCollisions(bullets: Bullet[], circleBumpers: CircleBumper[]) : void {
        for (let bullet of bullets) {
            this.checkBulletAgainstCircleBumpers(bullet, circleBumpers);
        }
    }

    private checkBulletAgainstCircleBumpers(bullet: Bullet, circleBumpers: CircleBumper[]): void {
        for (let bumper of circleBumpers) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, bullet.position, bullet.radius)) {
                let colNormal: Point = Utils.getTargetDirectionNormal(bumper.position, bullet.position);
                // Adjust bullet direction before colNorm * speed
                bullet.direction = Point.Reflect(bullet.direction, colNormal); 
                // Adjust bullet position by collision normal to prevent further collisions
                colNormal.x *= bullet.moveSpeed;
                colNormal.y *= bullet.moveSpeed;
                bullet.position.x -= colNormal.x;
                bullet.position.y -= colNormal.y;
            }
        }
    }
    
    public checkPlayerCollisions(player: Player, circleBumpers: CircleBumper[]): void {
        for (let bumper of circleBumpers) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, player.position, player.radius)) {
                // Adjust player position to avoid further collisions
                let offset = Utils.ReboundOffset(bumper.position, player.position, player.moveSpeed);
                player.position.x -= offset.x;
                player.position.y -= offset.y;
            }
        }
    }
}