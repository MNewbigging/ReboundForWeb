/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />
/// <reference path="entityManager.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
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
                // Reset bullet cooldown timer
                this.timeBetweenShots = this.maxTimeBetweenShots;
            }
        }
    }

    update(): void {
        // Only move the player if it won't collide with an obstacle
        if (!this.playerWillCollideWithBumper()) {
            super.update();
        }

        // Tick down time between shots
        this.timeBetweenShots -= 1;

        // Clear current dir to stop player moving into next frame
        this.direction.x = 0;
        this.direction.y = 0;

        // Clear or update dead/live bullets
        this.manageBullets();
    }

    private playerWillCollideWithBumper(): boolean {
        let playerWillCollide: boolean = false;
        // Simulate where player will be next frame
        let nextPos = new Point(this.position.x, this.position.y);
        let speed: number = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        nextPos.x += (this.direction.x * speed);
        nextPos.y += (this.direction.y * speed);

        // Use the next frame pos to check for collisions with circle bumpers
        for (let bumper of EntityManager.getInstance().getCircleBumpers()) {
            if (Utils.CirclesIntersect(bumper.position, bumper.radius, nextPos, this.radius)) {
                playerWillCollide = true;
                break;
            }
        }
        
        // Do the same collision checks against rectangle bumpers
        for (let bumper of EntityManager.getInstance().getRectBumpers()) {
            if (Utils.isCircleInsideRectArea(bumper.position, bumper.width, bumper.height, nextPos, this.radius)) {
                playerWillCollide = true;
                break;
            }
        }

        return playerWillCollide;
    }

    private manageBullets(): void {
        // Remove any dead bullets (outside of canvas) and update the rest
        for(let i: number = 0; i < this.bullets.length; i++) {
            if (this.bullets[i].outOfBounds) {
                this.bullets.splice(i, 1);
            }
            else {
                this.bullets[i].update();
            }
        } 
    }
}