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
        return Math.sqrt(Point.LengthSq(point));
    }

    public static LengthSq(point: Point): number {
        return (point.x * point.x) + (point.y * point.y);
    }

    public static Normalize(point: Point): Point {
        let length: number = this.Length(point);
        return new Point(point.x / length, point.y / length);
    }

    public static Dot(p1: Point, p2: Point): number {
        return (p1.x * p2.x) + (p1.y * p2.y);
    }

    public static Reflect(p1: Point, p2: Point): Point {
        // p1 - 2 * Dot(p1, p2) * p2;
        let scalar: number = 2 * this.Dot(p1, p2);
        let scaledPoint: Point = new Point(p2.x * scalar, p2.y * scalar);
        return new Point(p1.x - scaledPoint.x, p1.y - scaledPoint.y);
    }

    public static Print(point: Point, pre?: string): void {
        if (!pre) {
            pre = "";
        }
        console.log(`${pre} (${point.x}, ${point.y})`);
    }
}

class Utils {
    public static getTargetDirectionNormal(target: Point, position: Point): Point {
        let positionToTarget: Point = Point.Subtract(target, position);
        return Point.Normalize(positionToTarget);
    }

    public static CirclesIntersect(c1pos: Point, c1r: number, c2pos: Point, c2r: number): boolean {
        let distance: Point = Point.Subtract(c1pos, c2pos);
        let radii: number = c1r + c2r;
        
        return Point.LengthSq(distance) < radii * radii;
    }

    public static ReboundOffset(p1: Point, p2: Point, step: number): Point {
        let colNorm: Point = Utils.getTargetDirectionNormal(p1, p2);
        colNorm.x *= step;
        colNorm.y *= step;
        return colNorm;
    }
}