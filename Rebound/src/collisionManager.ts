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
    
    public checkPlayerCollisions(player: Player, circleBumpers: CircleBumper[], rectBumpers: RectangleBumper[]): void {
        for (let bumper of circleBumpers) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, player.position, player.radius)) {
                // Adjust player position to avoid further collisions
                let offset = Utils.ReboundOffset(bumper.position, player.position, player.moveSpeed);
                player.position.x -= offset.x;
                player.position.y -= offset.y;
            }
        }

        for (let bumper of rectBumpers) {
            // Distance check before performing collision detection
            let distance: Point = Point.Subtract(bumper.position, player.position);
            let xIntersectLeft: boolean = false;
            let xIntersectRight: boolean = false;
            let yIntersectTop: boolean = false;
            let yIntersectBot: boolean = false;
            let colNormal: Point = new Point();
            // Do checks based on relative position; is distance x or y negative? 
            if (distance.x > 0 && distance.x < player.radius) {
                xIntersectLeft = true;
                colNormal.x = -1;
            }
            else if (distance.x <= 0 && Math.abs(distance.x) < bumper.width + player.radius) {
                xIntersectRight = true;
                colNormal.x = 1;
            }
            if(distance.y > 0 && distance.y < player.radius) {
                yIntersectTop = true;
                colNormal.y = -1;
            }
            else if (distance.y <= 0 && Math.abs(distance.y) < bumper.height + player.radius) {
                yIntersectBot = true;
                colNormal.y = 1;
            }

            if (xIntersectLeft || xIntersectRight) {
                if (yIntersectBot || yIntersectTop) {
                    player.position.x += colNormal.x * player.moveSpeed;
                    player.position.y += colNormal.y * player.moveSpeed;
                    player.direction.x = 0;
                    player.direction.y = 0;
                }
            }
        }
    }
}