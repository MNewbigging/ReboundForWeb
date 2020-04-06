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

    public moveRight = (): void => {
        if (this.shape.x < 600 - this.moveSpeed - this.shape.radius) {
            this.shape.x += this.moveSpeed;
        }
     
    }

    public moveUp = (): void => {
        if (this.shape.y > this.moveSpeed + this.shape.radius) {
            this.shape.y -= this.moveSpeed;
        }   
    }

    public moveDown = (): void => {
        if (this.shape.y < 800 - this.moveSpeed - this.shape.radius) {
            this.shape.y += this.moveSpeed;
        }
        
    }
}