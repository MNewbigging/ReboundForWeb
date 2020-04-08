/// <reference path= "canvasUtils.ts" />
/// <reference path="utils.ts" />

interface IEntity {
    canvasUtils: CanvasUtils;
    position: Point;
    color: string;
    lineWidth: number;
    draw() : void;
}

interface IMovingEntity {
    direction: Point;
    moveSpeed: number;
    update(): void;
}

interface ICircleEntity {
    radius: number;
}

interface IRectangleEntity {
    width: number;
    height: number;
    strokeStyle: string;
}

class RectangleEntity implements IEntity, IRectangleEntity {
    // IEntity fields 
    canvasUtils: CanvasUtils;
    position: Point;
    color: string;
    lineWidth: number;
    // IRectangleEntity fields
    width: number;
    height: number;
    strokeStyle: string;

    constructor(p: Point, col: string, lw: number, w: number, h: number, stroke: string) {
        this.canvasUtils = CanvasUtils.getInstance();
        this.position = p;
        this.color = col;
        this.lineWidth = lw;
        this.width = w;
        this.height = h;
        this.strokeStyle = stroke;
    }


    draw(): void {
        let canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.strokeStyle = this.strokeStyle;
        canvasContext.fillStyle = this.color;
        canvasContext.rect(this.position.x, this.position.y, this.width, this.height);
        canvasContext.stroke();
        canvasContext.restore();
    }
}

class CircleEntity implements IEntity, ICircleEntity {
    // IEntity fields default values
    canvasUtils: CanvasUtils;
    position: Point;
    color: string;
    lineWidth: number;
    // ICircleEntity fields default values
    radius: number;

    constructor(p: Point, col: string, lw: number, r: number) {
        this.canvasUtils = CanvasUtils.getInstance();
        this.position = p;
        this.color = col;
        this.lineWidth = lw;
        this.radius = r;
    }

    draw(): void {
        let canvasContext = this.canvasUtils.getCanvasContext();
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    }
}

class CircleMovingEntity extends CircleEntity implements IMovingEntity {
    // IMovingEntity fields default values
    direction: Point;
    moveSpeed: number;

    constructor(p: Point, col: string, lw: number, r: number, dir: Point, speed: number) {
        super(p, col, lw, r);
        this.direction = dir;
        this.moveSpeed = speed;
    }


    update(): void {
        // Check if moving diagonally, cap speed
        let speed: number = (this.direction.x != 0 && this.direction.y != 0) ? this.moveSpeed * 0.8 : this.moveSpeed;
        this.position.x += (this.direction.x * speed);
        this.position.y += (this.direction.y * speed);
    }
    
}
