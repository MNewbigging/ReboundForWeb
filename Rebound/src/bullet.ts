/// <reference path="entities.ts" />

class Bullet extends CircleMovingEntity {
    public lifetime: number = 100;
    public active: boolean = false;

    constructor(px: number, py: number, dx: number, dy: number) {
        super(px, py, dx, dy, "red", 1, 5, 5);
    }

}