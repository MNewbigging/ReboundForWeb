/// <reference path="shapes.ts" />

class Player {
    public shape: Circle;
    public moveSpeed: number;
    public direction = {
        dirX: 0,
        dirY: 0
    };

    constructor() {
        this.shape = new Circle(100, 100, 10, "green");
        this.moveSpeed = 3;
    }

    public moveLeft = (): void => {
        // Ensure player doesn't leave canvas
        if (this.shape.x > this.moveSpeed + this.shape.radius) {
            this.direction.dirX = -1;
            this.move();
        }    
    }

    public moveRight (canvasWidth: number): void {
        if (this.shape.x < canvasWidth - this.moveSpeed - this.shape.radius) {
            this.direction.dirX = 1;
            this.move();
        }
    }


    public moveUp = (): void => {
        if (this.shape.y > this.moveSpeed + this.shape.radius) {
            this.direction.dirY = -1;
            this.move();
        }   
    }

    public moveDown(canvasHeight: number): void {
        if (this.shape.y < canvasHeight - this.moveSpeed - this.shape.radius) {
            this.direction.dirY = 1;
            this.move();
        } 
    }

    public move() { 
        // Check if moving diagonally, cap speed
        let speed: number = (this.direction.dirX != 0 && this.direction.dirY != 0) ? this.moveSpeed * 0.5 : this.moveSpeed;

        this.shape.x += (this.direction.dirX * this.moveSpeed);
        this.shape.y += (this.direction.dirY * this.moveSpeed);
        this.direction.dirX = 0;
        this.direction.dirY = 0;
    }
}