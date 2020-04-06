/// <reference path="shapes.ts" />

class Player {
    public shape: Circle;
    public moveSpeed: number;

    constructor() {
        this.shape = new Circle(100, 100, 10, "green");
        this.moveSpeed = 3;
    }

    public moveLeft = (): void => {
        // Ensure player doesn't leave canvas
        if (this.shape.x > this.moveSpeed + this.shape.radius) {
            this.shape.x -= this.moveSpeed;
        }    
    }

    moveRight (canvasWidth: number): void {
        if (this.shape.x < canvasWidth - this.moveSpeed - this.shape.radius) {
            this.shape.x += this.moveSpeed;
        }
    }


    public moveUp = (): void => {
        if (this.shape.y > this.moveSpeed + this.shape.radius) {
            this.shape.y -= this.moveSpeed;
        }   
    }

    public moveDown(canvasHeight: number): void {
        if (this.shape.y < canvasHeight - this.moveSpeed - this.shape.radius) {
            this.shape.y += this.moveSpeed;
        }
        
    }
}