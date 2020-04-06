interface iShape {
    draw(canvasContext: CanvasRenderingContext2D) : void;
    x: number;
    y: number;
    color: string;
    lineWidth: number;
}

class Circle implements iShape {
    public x: number = 0;
    public y: number = 0;
    public radius: number = 10;
    public lineWidth: number = 2;
    public color: string = "red";

    constructor(x: number, y: number, radius: number, color: string = "red", lineWidth: number = 2) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.lineWidth = lineWidth;
    }
    
    public draw = (canvasContext: CanvasRenderingContext2D): void => {
        canvasContext.save();
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        canvasContext.strokeStyle = this.color;
        canvasContext.stroke();
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
        canvasContext.lineWidth = this.lineWidth;
        canvasContext.restore();
    }
}