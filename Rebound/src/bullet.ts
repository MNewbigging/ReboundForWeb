/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public active: boolean = false;

    constructor(px: number, py: number, dx: number, dy: number) {
        super(px, py, dx, dy, "red", 1, 20, 5);
    }

    update(): void {
        // Delete bullet if outside of canvas
        super.update();
    }
}