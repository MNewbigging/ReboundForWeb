/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];
    public lastDirX: number = 0;
    public lastDirY: number = -1;

    constructor() {
        super(50, 50, 0, 0, "green", 2, 3, 10);        
        this.bullets = [];
    }

    public moveLeft = (): void => {
        // Ensure player doesn't leave canvas
        if (this.posX > this.moveSpeed + this.radius) {
            this.dirX = -1;
        }    
    }

    public moveRight (canvasWidth: number): void {
        if (this.posX < canvasWidth - this.moveSpeed - this.radius) {
            this.dirX = 1;
        }
    }

    public moveUp = (): void => {
        if (this.posY > this.moveSpeed + this.radius) {
            this.dirY = -1;
        }   
    }

    public moveDown(canvasHeight: number): void {
        if (this.posY < canvasHeight - this.moveSpeed - this.radius) {
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
    }

}