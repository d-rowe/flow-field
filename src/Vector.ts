export default class Vector {
    declare angle: number;

    constructor(angle: number) {
        this.angle = angle;
    }

    get x(): number {
        return Math.cos(this.angle);
    }

    get y(): number {
        return Math.sin(this.angle);
    }
}