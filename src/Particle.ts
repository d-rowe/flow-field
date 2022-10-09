export default class Particle {
    declare x: number;
    declare y: number;
    declare private xVel: number;
    declare private yVel: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    move(x: number, y: number): void {
        this.x += x;
        this.y += y;
    }
}