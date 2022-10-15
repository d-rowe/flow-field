import Particle from './Particle';

const MAX_LENGTH = 1;

// Linked list of particles
export default class ParticleTrail {
    declare head?: ParticleNode;
    declare tail?: ParticleNode;
    declare length: number;

    constructor() {
        this.length = 0;
    }

    addParticle(x: number, y: number): ParticleNode {
        const particle = new Particle(x, y);
        const particleNode = new ParticleNode(particle);

        const lastHead = this.head;
        this.head = particleNode;
        this.head.next = lastHead;
        if (lastHead) {
            lastHead.prev = particleNode;
        }
        this.length += 1;

        if (!this.tail) {
            this.tail = particleNode;
        }


        while (this.length > MAX_LENGTH) {
            this.removeLastParticle();
        }

        return particleNode;
    }

    removeLastParticle(): void {
        if (this.tail && this.tail.prev) {
            this.tail = this.tail.prev;
            this.tail.next = undefined;
            this.length -= 1;
        }
    }
}

export class ParticleNode {
    declare particle: Particle;
    declare next?: ParticleNode;
    declare prev?: ParticleNode;

    constructor(particle: Particle, next?: ParticleNode, prev?: ParticleNode) {
        this.particle = particle;
        this.next = next;
        this.prev = prev;
    }
}
