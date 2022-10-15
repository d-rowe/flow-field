import ParticleTrail from './ParticleTrail';
import VectorField from "./VectorField";

const DEFAULT_MAX_PARTICLES = 10000;
const FIELD_SCALE = 10;
const PARTICLE_SIZE = 1;

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const { width: pageWidth, height: pageHeight } = container.getBoundingClientRect();
let width = pageWidth * devicePixelRatio;
let height = pageHeight * devicePixelRatio;
const canvas = createCanvas();
container.append(canvas);
const ctx = canvas.getContext('2d')!;
let fieldWidth = width / FIELD_SCALE;
let fieldHeight = height / FIELD_SCALE;
const vectorField = new VectorField(fieldWidth, fieldHeight);
const particleTrails: ParticleTrail[] = [];
const params = new URLSearchParams(document.location.search);
const shouldDrawField = Boolean(params.get('field'));
const paramParticles = params.get('particles');
const maxTrails = (paramParticles && Number(paramParticles)) ?? DEFAULT_MAX_PARTICLES;

requestAnimationFrame(animate);

function animate(time: number) {
    vectorField.update(time);
    createParticleTrails();
    clear();
    drawField();
    updateAndDrawParticleTrails();
    requestAnimationFrame(animate);
}

function updateAndDrawParticleTrails() {
    particleTrails.forEach((particleTrail, i) => {
        if (Math.random() > 0.999) {
            particleTrails.splice(i, 1);
        }
        const { head } = particleTrail;
        if (!head) {
            return;
        }
        const { particle } = head;
        const fieldX = Math.floor(particle.x / FIELD_SCALE);
        const fieldY = Math.floor(particle.y / FIELD_SCALE);
        let currentNode = particleTrail.head;
        const vector = vectorField.getVector(fieldX, fieldY);
        if (vector) {
            currentNode = particleTrail.addParticle(
                particle.x + (vector.x * 4),
                particle.y + vector.y * 4
            );
        } else {
            particleTrail.removeLastParticle();
            if (particleTrail.length < 2) {
                particleTrails.splice(i, 1);
            }
        }
        let alpha = 0.3;
        while (currentNode) {
            const currentParticle = currentNode.particle;
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha}`;
            ctx.beginPath();
            ctx.arc(currentParticle.x, currentParticle.y, PARTICLE_SIZE, 0, 2 * Math.PI);
            ctx.fill();
            currentNode = currentNode.next;
            alpha -= 1 / particleTrail.length;
        }
    });
}

function drawField() {
    if (!shouldDrawField) {
        return;
    }
    for (let fieldY = 0; fieldY < fieldHeight; fieldY++) {
        for (let fieldX = 0; fieldX < fieldWidth; fieldX++) {
            const vector = vectorField.getVector(fieldX, fieldY);
            if (!vector) {
                continue;
            }
            const startX = fieldX * FIELD_SCALE;
            const startY = fieldY * FIELD_SCALE;
            const endX = startX + (vector.x * FIELD_SCALE);
            const endY = startY + (vector.y * FIELD_SCALE);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#fb8500';
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
}

function createParticleTrails() {
    if (particleTrails.length >= maxTrails) {
        return;
    }
    for (let i = 0; i < maxTrails; i++) {
        if (particleTrails.length >= maxTrails) {
            break;
        }
        const trail = new ParticleTrail();
        trail.addParticle(
            Math.random() * width,
            Math.random() * height,
        );
        particleTrails.push(trail);
    }
}

function clear() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute('style', `height: ${pageHeight}px; width: ${pageWidth}px`);
    return canvas;
}

window.onresize = () => {
    const { width: pageWidth, height: pageHeight } = container.getBoundingClientRect();
    width = pageWidth * devicePixelRatio;
    height = pageHeight * devicePixelRatio;
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute('style', `height: ${pageHeight}px; width: ${pageWidth}px`);
    fieldWidth = width / FIELD_SCALE;
    fieldHeight = height / FIELD_SCALE;
    vectorField.width = fieldWidth;
    vectorField.height = fieldHeight;
    clear();
};