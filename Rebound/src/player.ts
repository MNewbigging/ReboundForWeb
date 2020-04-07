/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />
/// <reference path="utils.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
    public lastDir: Point = new Point(0, -1);

    constructor() {
        super(20, 20, 0, 0, "green", 2, 3, 10);   
        this.canvasUtils = CanvasUtils.getInstance();     
        this.bullets = [];
    }

    public moveLeft = (): void => {
        if (!this.canvasUtils.outOfBoundsLeftOrTop(this.pos.x, this.moveSpeed, this.radius)) {
            this.dir.x = -1;
        }
    }

    public moveRight = (): void => {
        if (!this.canvasUtils.outOfBoundsRight(this.pos.x, this.moveSpeed, this.radius)) {
            this.dir.x = 1;
        }
    }

    public moveUp = (): void => {
        if (!this.canvasUtils.outOfBoundsLeftOrTop(this.pos.y, this.moveSpeed, this.radius)) {
            this.dir.y = -1;
        }   
    }

    public moveDown = (): void => {
        if (!this.canvasUtils.outOfBoundsBottom(this.pos.y, this.moveSpeed, this.radius)) {
            this.dir.y = 1;
        } 
    }

    public fireShot = (): void => {
        Point.Print(this.canvasUtils.getMousePos(), "mouse pos:");
        Point.Print(this.pos, "player pos:");
        let playerToMouse: Point = Point.Subtract(this.canvasUtils.getMousePos(), this.pos);
        Point.Print(playerToMouse, "player to mouse");
        let normDir: Point = Point.Normalize(playerToMouse);
        Point.Print(normDir, "normalised:");

        this.bullets.push(new Bullet(
            this.pos.x, this.pos.y, 
            normDir.x, normDir.y
        ));
        
    }

    update(): void {
        super.update();
        
        // If there is a direction to save
        if (this.dir.x != 0 || this.dir.y != 0) {
            // Save current direction for bullets next frame
            this.lastDir.x = this.dir.x;
            this.lastDir.y = this.dir.y;
        }

        // Clear current dir to stop player moving into next frame
        this.dir.x = 0;
        this.dir.y = 0;

        // Remove any dead bullets (outside of canvas)
        for(let i: number = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].alive) {
                this.bullets.splice(i, 1);
            }
        }
    }

}