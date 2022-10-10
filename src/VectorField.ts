import { createNoise3D } from 'simplex-noise';
import Vector from './Vector';

import type { NoiseFunction3D } from 'simplex-noise';

type Field = Vector[][];

const noiseScale = 0.0002;
const timeNoiseScale = 0.0000005;

export default class VectorField {
    declare noise: NoiseFunction3D;
    declare width: number;
    declare height: number;
    declare z: number;
    declare field: Field;
    declare time: number;

    constructor(width: number, height: number, z = 0) {
        this.time = 0;
        this.noise = createNoise3D();
        this.width = width;
        this.height = height;
        this.z = z;
        this.field = this.constructField();
    }

    update(time: number): void {
        this.time = time;
        this.field = this.constructField();
    }

    getVector(x: number, y: number): Vector {
        if (x > this.width || x < 0 || y > this.height || y < 0) {
            throw new Error('Coordinate out of bounds');
        }
        return this.field[y][x];
    }

    private constructField(): Field {
        const field: Field = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                // map noise range -1 to 1 to angle between 0 to 360 degrees
                const angle = (this.noise(
                    x * noiseScale,
                    y * noiseScale,
                    this.time * timeNoiseScale,
                ) + 1) * 180;
                row.push(new Vector(angle));
            }
            field.push(row);
        }

        return field;
    }
}
