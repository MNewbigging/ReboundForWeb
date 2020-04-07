/// <reference path="entities.ts" />
/// <reference path="bullet.ts" />

class Player extends CircleMovingEntity {
    public bullets: Bullet[];

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
            this.dirX, this.dirY
        ));
    }

    update(): void { 
        super.update();
    }
}