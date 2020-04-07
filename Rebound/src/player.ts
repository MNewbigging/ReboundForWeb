/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
    public lastDir: Point = new Point(0, -1);

    constructor() {
        super(new Point(20, 20), "green", 2, 10, new Point(), 3);     
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
        let playerToMouse: Point = Point.Subtract(this.canvasUtils.getMousePos(), this.position);
        let normDir: Point = Point.Normalize(playerToMouse);

        this.bullets.push(new Bullet(new Point(this.position.x, this.position.y), normDir));
    }

    update(): void {
        super.update();
        
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