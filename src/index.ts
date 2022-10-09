import Particle from "./Particle";
import VectorField from "./VectorField";

const DEFAULT_MAX_PARTICLES = 200;
const FIELD_SCALE = 10;

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const { width: pageWidth, height: pageHeight } = container.getBoundingClientRect();
const width = pageWidth * devicePixelRatio;
const height = pageHeight * devicePixelRatio;
const canvas = createCanvas();
container.append(canvas);
const ctx = canvas.getContext('2d');
const fieldWidth = width / FIELD_SCALE;
const fieldHeight = height / FIELD_SCALE;
const vectorField = new VectorField(fieldWidth, fieldHeight);
const particles: Particle[] = [];
const params = new URLSearchParams(document.location.search);
const shouldClear = Boolean(params.get('refresh'));
const shouldDrawField = Boolean(params.get('field'));
const paramParticles = params.get('particles');
const maxParticles = (paramParticles && Number(paramParticles)) ?? DEFAULT_MAX_PARTICLES;

function createParticles() {
    if (particles.length >= maxParticles) {
        return;
    }
    for (let i = 0; i < maxParticles; i++) {
        if (particles.length >= maxParticles) {
            break;
        }
        particles.push(new Particle(
            Math.random() * width,
            Math.random() * height
        ));
    }
}

requestAnimationFrame(animate);

drawField();
function animate() {
    if (shouldClear) {
        clear();
        drawField();
    }
    createParticles();
    drawParticles();
    requestAnimationFrame(animate);
}

function drawParticles() {
    particles.forEach((particle, i) => {
        const fieldX = Math.floor(particle.x / FIELD_SCALE);
        const fieldY = Math.floor(particle.y / FIELD_SCALE);
        try {
            const vector = vectorField.getVector(fieldX, fieldY);
            particle.move(vector.x * 4, vector.y * 4);
            ctx!.fillStyle = '#219ebc';
            ctx?.beginPath();
            ctx?.arc(particle.x, particle.y, 1, 0, 2 * Math.PI);
            ctx?.fill();
        } catch (err) {
            particles.splice(i, 1);
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
            const startX = fieldX * FIELD_SCALE;
            const startY = fieldY * FIELD_SCALE;
            const endX = startX + (vector.x * FIELD_SCALE);
            const endY = startY + (vector.y * FIELD_SCALE);
            ctx!.lineWidth = 0.5;
            ctx!.strokeStyle = '#fb8500';
            ctx!.beginPath();
            ctx!.moveTo(startX, startY);
            ctx!.lineTo(endX, endY);
            ctx!.stroke();
        }
    }
}

function clear() {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
}

function createCanvas(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.setAttribute('style', `height: ${pageHeight}px; width: ${pageWidth}px`);
    return canvas;
}

container.addEventListener('click', (event: MouseEvent) => {
    const x = event.clientX * devicePixelRatio;
    const y = event.clientY * devicePixelRatio;
    particles.push(new Particle(x, y));
});
