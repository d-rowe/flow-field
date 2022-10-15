// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {noise} from '@chriscourses/perlin-noise';
import Vector from './Vector';

type Field = Vector[][];

const noiseScale = 0.005;
const timeNoiseScale = 0.00001;

export default class VectorField {
    declare width: number;
    declare height: number;
    declare z: number;
    declare field: Field;
    declare time: number;

    constructor(width: number, height: number, z = 0) {
        this.time = 0;
        this.width = width;
        this.height = height;
        this.z = z;
        this.field = this.constructField();
    }

    update(time: number): void {
        this.time = time;
        this.field = this.constructField();
    }

    getVector(x: number, y: number): Vector | null {
        if (x > this.width || x < 0 || y > this.height || y < 0) {
            return null;
        }
        return this.field[y][x];
    }

    private constructField(): Field {
        const field: Field = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                // map noise range -1 to 1 to angle between 0 to 360 degrees
                const angle = (noise(
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
