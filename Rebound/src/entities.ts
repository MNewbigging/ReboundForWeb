/// <reference path= "canvasUtils.ts" />
/// <reference path="utils.ts" />

interface IEntity {
    pos: Point;
    color: string;
    lineWidth: number;
    draw(canvasContext: CanvasRenderingContext2D) : void;
}

interface IMovingEntity {
    dir: Point;
    moveSpeed: number;
    update(): void;
}

interface ICircleEntity {
    radius: number;
}

class CircleMovingEntity implements IEntity, IMovingEntity, ICircleEntity {
    // IEntity fields default values
    pos: Point = new Point();
    color: string = "black";
    lineWidth: number =  2;
    // IMovingEntity fields default values
    dir: Point = new Point();
    moveSpeed: number = 2;
    // ICircleEntity fields default values
    radius: number = 10;
    canvasUtils: CanvasUtils;

    constructor(px: number, py: number, dx: number, dy: number, 
                col: string, lw: number, speed: number, r: number) {
        this.pos.x = px;
        this.pos.y = py;
        this.dir.x = dx;
        this.dir.y = dy;
        this.color = col;
        this.lineWidth = lw;
        this.moveSpeed = speed;
        this.radius = r;
        this.canvasUtils = CanvasUtils.getInstance();
    }

    update(): void {
        // Check if moving diagonally, cap speed
        let speed: number = (this.dir.x != 0 && this.dir.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        this.pos.x += (this.dir.x * speed);
        this.pos.y += (this.dir.y * speed);
    }

    draw(): void {
        let canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    }

    
}
