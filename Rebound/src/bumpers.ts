/// <reference path="entities.ts" />
/// <reference path="utils.ts" />

class CircleBumper extends CircleEntity {
    /*
    Might want surface effect type here
    */
}

class RectangleBumper extends RectangleEntity {
    // Store list of vertices
    public vertices: Point[];

    constructor(p: Point, col: string, lw: number, w: number, h: number, stroke: string) {
        super(p, col, lw, w, h, stroke);
        this.vertices = [];

        this.findVertices();
    }

    private findVertices(): void {
        this.vertices.push(this.position);
        this.vertices.push(new Point(this.position.x + this.width, this.position.y));
        this.vertices.push(new Point(this.position.x + this.width, this.position.y + this.height));
        this.vertices.push(new Point(this.position.x, this.position.y + this.height));
    }
}