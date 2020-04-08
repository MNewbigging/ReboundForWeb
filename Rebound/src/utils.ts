class Point {
    public x: number = 0;
    public y: number = 0;

    constructor(xVal: number = 0, yVal: number = 0) {
        this.x = xVal;
        this.y = yVal;
    }

    public static Add(p1: Point, p2: Point) {
        return new Point(
            p1.x + p2.x,
            p1.y + p2.y
        );
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
    // p1, p2 are for line end points
    // center is center point of circle 
    public static CircleToLineIntersect(p1: Point, p2: Point, center: Point, radius: number): boolean {
        // Find closest point on line from center given
        let closestPoint: Point = new Point();
        // Get the line from two points given, normalize
        let line: Point = Point.Subtract(p2, p1);
        let lineNorm: Point = Point.Normalize(line);
        // Get distance form player to p1
        let p1Distance: Point = Point.Subtract(center, p1);
        // Use dot product to check if p1 is closest point
        let projection: number = Point.Dot(p1Distance, lineNorm);

        if (projection < 0) {
            closestPoint = p1;
        }
        else if (projection > Point.Length(line)) {
            closestPoint = p2;
        }
        else {
            // Closest point is more central on the line
            let projectionVelocity: Point = new Point(lineNorm.x * projection, lineNorm.y * projection);
            closestPoint = Point.Add(projectionVelocity, p1);
        }

        let closestDifference: Point = Point.Subtract(center, closestPoint);
        let closestLength = Point.Length(closestDifference);
        if (closestLength <= radius) {
            return true;
        }

        return false;
    }

    public static isCircleInsideRectArea(rectPos: Point, rectWidth: number, rectHeight: number, circlePos: Point, circleRadius: number): boolean {
        let circleInside: boolean = false;
        let xIntersect: boolean = false;
        let yIntersect: boolean = false;
        // Get distance vector between rect pos (top left origin) and circle pos
        let distance: Point = Point.Subtract(rectPos, circlePos);
        
        if (distance.x > 0 && distance.x < circleRadius) {
            xIntersect = true;
        }
        else if (distance.x <= 0 && Math.abs(distance.x) < rectWidth + circleRadius) {
            xIntersect = true;
        }
        if(distance.y > 0 && distance.y < circleRadius) {
            yIntersect = true;
        }
        else if (distance.y <= 0 && Math.abs(distance.y) < rectHeight + circleRadius) {
            yIntersect = true;
        }
        if (xIntersect && yIntersect) {
            circleInside = true;
        }

        return circleInside;
    }
}