/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />
/// <reference path="canvasUtils.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
    public lastDirX: number = 0;
    public lastDirY: number = -1;

    constructor() {
        super(50, 50, 0, 0, "green", 2, 3, 10);   
        this.canvasUtils = CanvasUtils.getInstance();     
        this.bullets = [];
    }

    public moveLeft = (): void => {
        if (!this.canvasUtils.outOfBoundsLeftOrTop(this.posX, this.moveSpeed, this.radius)) {
            this.dirX = -1;
        }
    }

    public moveRight = (): void => {
        if (!this.canvasUtils.outOfBoundsRight(this.posX, this.moveSpeed, this.radius)) {
            this.dirX = 1;
        }
    }

    public moveUp = (): void => {
        if (!this.canvasUtils.outOfBoundsLeftOrTop(this.posY, this.moveSpeed, this.radius)) {
            this.dirY = -1;
        }   
    }

    public moveDown = (): void => {
        if (!this.canvasUtils.outOfBoundsBottom(this.posY, this.moveSpeed, this.radius)) {
            this.dirY = 1;
        } 
    }

    public fireShot = (): void => {
        this.bullets.push(new Bullet(
            this.posX, this.posY, 
            this.lastDirX, this.lastDirY
        ));
    }

    update(): void {
        super.update();
        
        // If there is a direction to save
        if (this.dirX != 0 || this.dirY != 0) {
            // Save current direction for bullets next frame
            this.lastDirX = this.dirX;
            this.lastDirY = this.dirY;
        }

        // Clear current dir to stop player moving into next frame
        this.dirX = 0;
        this.dirY = 0;

        // Remove any dead bullets (outside of canvas)
        for(let i: number = 0; i < this.bullets.length; i++) {
            if (!this.bullets[i].alive) {
                this.bullets.splice(i, 1);
            }
        }
    }

}