/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
    public lastDir: Point = new Point(0, -1);
    private maxBullets: number = 30;
    private timeBetweenShots: number = 0;
    private maxTimeBetweenShots: number = 30;

    constructor() {
        super(new Point(20, 20), "green", 2, 10, new Point(), 5);     
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
        // Ensure player hasn't reached max bullet count yet
        if (this.bullets.length < this.maxBullets) {
            // and make sure time between shots has run out
            if (this.timeBetweenShots <= 0) {
                this.bullets.push(new Bullet(
                    new Point(this.position.x, this.position.y), 
                    Utils.getTargetDirectionNormal(this.canvasUtils.getMousePos(), this.position)
                ));
                // Reset bullet timer
                this.timeBetweenShots = this.maxTimeBetweenShots;
            }
        }
    }

    private playerWillCollideWithBumper(): boolean {
        let playerWillCollide: boolean = false;
        // Simulate where player will be next frame
        let nextPos = new Point(this.position.x, this.position.y);
        let speed: number = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        nextPos.x += (this.direction.x * speed);
        nextPos.y += (this.direction.y * speed);

        // Use the next frame pos to check for collisions
        for (let bumper of EntityManager.getInstance().getCircleBumpers()) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, nextPos, this.radius)) {
                playerWillCollide = true;
            }
        }

        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            // Distance check before performing collision detection
            let distance: Point = Point.Subtract(bumper.position, nextPos);
            let xIntersect: boolean = false;
            let yIntersect: boolean = false;
            // Do checks based on relative position; is distance x or y negative? 
            if (distance.x > 0 && distance.x < this.radius) {
                xIntersect = true;
            }
            else if (distance.x <= 0 && Math.abs(distance.x) < bumper.width + this.radius) {
                xIntersect = true;
            }
            if(distance.y > 0 && distance.y < this.radius) {
                yIntersect = true;
            }
            else if (distance.y <= 0 && Math.abs(distance.y) < bumper.height + this.radius) {
                yIntersect = true;
            }
            if (xIntersect && yIntersect) {
                playerWillCollide = true;
            }
        }

        return playerWillCollide;
    }

    update(): void {
        // Only move the player if it won't collide with an obstacle
        if (!this.playerWillCollideWithBumper()) {
            super.update();
        }

        // Tick down time between shots
        this.timeBetweenShots -= 1;

        // If there is a direction to save
        if (this.direction.x != 0 || this.direction.y != 0) {
            // Save current direction for bullets next frame
            this.lastDir.x = this.direction.x;
            this.lastDir.y = this.direction.y;
        }

        // Clear current dir to stop player moving into next frame
        this.direction.x = 0;
        this.direction.y = 0;

        // Remove any dead bullets (outside of canvas) and update the rest
        for(let i: number = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].alive) {
                this.bullets.splice(i, 1);
            }
            else {
                this.bullets[i].update();
            }
        }       
    }

}