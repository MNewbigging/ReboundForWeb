/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
    private maxBullets: number = 20;
    private timeBetweenShots: number = 0;
    private maxTimeBetweenShots: number = 30;
    public alive: boolean = true;
    private respawnCooldownMax: number = 100;
    private respawnCooldown: number = 0;
    private spawnPoint: Point;

    constructor(pos: Point) {
        super(pos, "green", 2, 10, new Point(), 5);     
        this.spawnPoint = new Point(pos.x, pos.y);
        this.bullets = [];
    }

    public moveLeft = (): void => {
        if (!this.canvasUtils.outOfBoundsLeftOrTop(this.position.x, this.moveSpeed, this.radius)) {
            this.direction.x = -1;
        }
    }

    public moveRight = (): void => {
        if (!this.canvasUtils.outOfBoundsRight(this.position.x, this.moveSpeed, this.radius)) {
            this.direction.x = 1;
        }
    }

    public moveUp = (): void => {
        if (!this.canvasUtils.outOfBoundsLeftOrTop(this.position.y, this.moveSpeed, this.radius)) {
            this.direction.y = -1;
        }   
    }

    public moveDown = (): void => {
        if (!this.canvasUtils.outOfBoundsBottom(this.position.y, this.moveSpeed, this.radius)) {
            this.direction.y = 1;
        } 
    }

    public fireShot = (): void => {
        // Ensure player is alive and hasn't reached max bullet count yet
        if (this.alive && this.bullets.length < this.maxBullets) {
            // and make sure time between shots has run out
            if (this.timeBetweenShots <= 0) {
                this.bullets.push(new Bullet(
                    new Point(this.position.x, this.position.y), 
                    Utils.getTargetDirectionNormal(this.canvasUtils.getMousePos(), this.position)
                ));
                // Reset bullet cooldown timer
                this.timeBetweenShots = this.maxTimeBetweenShots;
            }
        }
    }

    update(): void {
        // If dead, tick down respawn cooldown timer
        if (!this.alive) {
            if (this.respawnCooldown <= 0) {
                this.respawn();
            } 
            else {
                this.respawnCooldown--;
            }
        } 
        else {
            // Only move the player if it won't collide with an obstacle
            if (!this.playerWillCollideWithBumper()) {
                super.update();
            }

            // Tick down time between shots
            this.timeBetweenShots -= 1;

            // Clear current dir to stop player moving into next frame
            this.direction.x = 0;
            this.direction.y = 0;
        }

        // Update bullets
        for (let bullet of this.bullets) {
            bullet.update();
        }
    }

    private playerWillCollideWithBumper(): boolean {
        // Simulate where player will be next frame
        let nextPos = new Point(this.position.x, this.position.y);
        let speed: number = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        nextPos.x += (this.direction.x * speed);
        nextPos.y += (this.direction.y * speed);

        // Only test against closest circle bumper
        let closest: number = EntityManager.getInstance().getClosestCircleBumperIndex(nextPos);
        let bumpers: CircleBumper[] = EntityManager.getInstance().getCircleBumpers();
        if (Utils.CirclesIntersect(bumpers[closest].position, bumpers[closest].radius, nextPos, this.radius)) {
            return true;
        }
        
        // Do collision checks against all rectangle bumpers
        // This is actually cheaper than only testing closest, because you would 
        // need to test against closest point on rectangle to player, not rect pos/center
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, nextPos, this.radius)) {
                return true;
            }
        }
        
        return false;
    }

    public die(): void {
        // Die
        this.alive = false;
        // Reset respawn timer
        this.respawnCooldown = this.respawnCooldownMax;
        // Change position back to spawn point
        this.position = new Point(this.spawnPoint.x, this.spawnPoint.y);
        // Update UI
        UiManager.getInstance().playerDeadMessage();
    }

    private respawn(): void {
        this.alive = true;
        // Update UI element to show we have respawned
        UiManager.getInstance().playerRespawnMessage();
    }
}