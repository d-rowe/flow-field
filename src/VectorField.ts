// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import {noise} from '@chriscourses/perlin-noise';
import Vector from './Vector';

type Field = Vector[][];

const DEFAULT_NOISE_SCALE = 0.005;
const DEFAULT_TIME_NOISE_SCALE = 0.00001;

export default class VectorField {
    declare width: number;
    declare height: number;
    declare z: number;
    declare field: Field;
    declare time: number;
    declare noiseScale: number;
    declare timeNoiseScale: number;

    constructor(width: number, height: number, z = 0) {
        this.time = 0;
        this.noiseScale = DEFAULT_NOISE_SCALE;
        this.timeNoiseScale = DEFAULT_TIME_NOISE_SCALE;
        this.width = width;
        this.height = height;
        this.z = z;
        this.field = this.constructField();
    }

    update(time: number, noiseScale?: number, timeNoiseScale?: number): void {
        this.time = time;
        if (noiseScale !== undefined) {
            this.noiseScale = noiseScale;
        }
        if (timeNoiseScale !== undefined) {
            this.timeNoiseScale = timeNoiseScale;
        }
        this.field = this.constructField();
    }

    getVector(x: number, y: number): Vector | null {
        if (this.field[y] && this.field[y][x]) {
            return this.field[y][x];
        }

        return null;
    }

    private constructField(): Field {
        const field: Field = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                // map noise range -1 to 1 to angle between 0 to 360 degrees
                const angle = (noise(
                    x * this.noiseScale,
                    y * this.noiseScale,
                    this.time * this.timeNoiseScale,
                ) + 1) * 180;
                row.push(new Vector(angle));
            }
            field.push(row);
        }

        return field;
    }
}
