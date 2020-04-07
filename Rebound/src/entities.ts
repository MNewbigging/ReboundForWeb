/// <reference path= "canvasUtils.ts" />

interface IEntity {
    posX: number;
    posY: number;
    color: string;
    lineWidth: number;
    draw(canvasContext: CanvasRenderingContext2D) : void;
}

interface IMovingEntity {
    dirX: number;
    dirY: number;
    moveSpeed: number;
    update(): void;
}

interface ICircleEntity {
    radius: number;
}

class CircleMovingEntity implements IEntity, IMovingEntity, ICircleEntity {
    // IEntity fields default values
    posX: number = 0;
    posY: number = 0;
    color: string = "black";
    lineWidth: number =  2;
    // IMovingEntity fields default values
    dirX: number;
    dirY: number;
    moveSpeed: number = 2;
    // ICircleEntity fields default values
    radius: number = 10;
    canvasUtils: CanvasUtils;

    constructor(px: number, py: number, dx: number, dy: number, 
                col: string, lw: number, speed: number, r: number) {
        this.posX = px;
        this.posY = py;
        this.dirX = dx;
        this.dirY = dy;
        this.color = col;
        this.lineWidth = lw;
        this.moveSpeed = speed;
        this.radius = r;
        this.canvasUtils = CanvasUtils.getInstance();
    }

    update(): void {
        // Check if moving diagonally, cap speed
        let speed: number = (this.dirX != 0 && this.dirY != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        this.posX += (this.dirX * speed);
        this.posY += (this.dirY * speed);
    }

    draw(): void {
        let canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    }
}
