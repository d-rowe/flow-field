import options from './options';

export default class Particle {
    declare ctx: CanvasRenderingContext2D;
    declare lastX: number;
    declare lastY: number;
    declare x: number;
    declare y: number;
    declare xVel: number;
    declare yVel: number;

    constructor(ctx: CanvasRenderingContext2D,x: number, y: number) {
        this.ctx = ctx;
        this.lastX = x;
        this.lastY = 0;
        this.x = x;
        this.y = y;
        this.xVel = 0;
        this.yVel = 0;
    }

    draw(): void {
        if (options.drawLines) {
            this.ctx.strokeStyle = `rgba(255, 255, 255, ${options.particleAlpha})`;
            this.ctx.lineWidth = options.particleSize;
            this.ctx.beginPath();
            this.ctx.moveTo(this.lastX, this.lastY);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
            return;
        }

        this.ctx.fillStyle = `rgba(255, 255, 255, ${options.particleAlpha})`;
        this.ctx.beginPath();
        this.ctx.arc(
            Math.floor(this.x),
            Math.floor(this.y),
            options.particleSize,
            0,
            2 * Math.PI
        );
        this.ctx.fill();

    }

    move(x: number, y: number): void {
        const rawXVel = this.xVel + (x / options.particleMass);
        const rawYVel = this.yVel + (y / options.particleMass);
        const xVelDir = Math.abs(rawXVel) / rawXVel;
        const yVelDir = Math.abs(rawYVel) / rawYVel;
        if (xVelDir > 0) {
            this.xVel = Math.min(rawXVel, options.particleMaxSpeed);
        } else {
            this.xVel = Math.max(rawXVel, -options.particleMaxSpeed);
        }

        if (yVelDir > 0) {
            this.yVel = Math.min(rawYVel, options.particleMaxSpeed);
        } else {
            this.yVel = Math.max(rawYVel, -options.particleMaxSpeed);
        }
        this.lastX = this.x;
        this.lastY = this.y;
        this.x += this.xVel;
        this.y += this.yVel;
        this.xVel *= 1 - options.friction;
        this.yVel *= 1 - options.friction;
    }
}