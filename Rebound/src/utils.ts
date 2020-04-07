class Point {
    public x: number = 0;
    public y: number = 0;

    constructor(xVal: number = 0, yVal: number = 0) {
        this.x = xVal;
        this.y = yVal;
    }

    public static Subtract(left: Point, right: Point): Point {
        return new Point(
            left.x - right.x,
            left.y - right.y
        );
    }

    public static Length(point: Point): number {
        return Math.sqrt((point.x * point.x) + (point.y * point.y));
    }

    public static Normalize(point: Point): Point {
        let length: number = this.Length(point);
        return new Point(point.x / length, point.y / length);
    }

    public static Print(point: Point, pre?: string): void {
        if (!pre) {
            pre = "";
        }
        console.log(`${pre} (${point.x}, ${point.y})`);
    }
}