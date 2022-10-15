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
    declare flux: number;

    constructor(width: number, height: number, z = 0) {
        this.time = 0;
        this.noiseScale = DEFAULT_NOISE_SCALE;
        this.flux = DEFAULT_TIME_NOISE_SCALE;
        this.width = width;
        this.height = height;
        this.z = z;
        this.field = this.initializeField();
    }

    update(time: number, noiseScale?: number, flux?: number): void {
        this.time = time;
        if (noiseScale !== undefined) {
            this.noiseScale = noiseScale;
        }
        if (flux !== undefined) {
            this.flux = flux;
        }

        this.updateField();
    }

    getVector(x: number, y: number): Vector | null {
        if (this.field[y] && this.field[y][x]) {
            return this.field[y][x];
        }

        return null;
    }

    private initializeField(): Field {
        const field = [];
        for (let y = 0; y < this.height; y++) {
            field.push(new Array(this.width).fill(new Vector(0)));
        }
        return field;
    }

    private updateField(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // map noise range -1 to 1 to angle between 0 to 360 degrees
                const angle = (noise(
                    x * this.noiseScale,
                    y * this.noiseScale,
                    this.time * this.flux,
                ) + 1) * 180;
                this.field[y][x] = new Vector(angle);
            }
        }
    }
}
