import Particle from './Particle';
import VectorField from "./VectorField";

const params = {
    particleCount: 10000,
    particleSize: 1,
    fieldScale: 10,
    particleSurvivalRate: 97,
    frameAlpha: 0.02,
};

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
let fieldWidth = width / params.fieldScale;
let fieldHeight = height / params.fieldScale;
const vectorField = new VectorField(fieldWidth, fieldHeight);
const particles: Particle[] = [];

requestAnimationFrame(animate);

function animate(time: number) {
    vectorField.update(time);
    fillParticles();
    clearFrame();
    updateAndDrawParticleTrails();
    requestAnimationFrame(animate);
}

function updateAndDrawParticleTrails() {
    particles.forEach((particle, i) => {
        if (Math.random() > 0.97) {
            particles.splice(i, 1);
        }
        const fieldX = Math.floor(particle.x / params.fieldScale);
        const fieldY = Math.floor(particle.y / params.fieldScale);
        const vector = vectorField.getVector(fieldX, fieldY);
        if (vector) {
            particle.x += vector.x * 4;
            particle.y += vector.y * 4;
        } else {
            particles.splice(i, 1);
        }
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, params.particleSize, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function fillParticles() {
    const particleFillCount = params.particleCount - particles.length;
    for (let i = 0; i < particleFillCount; i++) {
        particles.push(new Particle(
            Math.random() * width,
            Math.random() * height,
        ));
    }
}

function clearFrame() {
    ctx.fillStyle = `rgba(0, 0, 0, ${params.frameAlpha})`;
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
    fieldWidth = width / params.fieldScale;
    fieldHeight = height / params.fieldScale;
    vectorField.width = fieldWidth;
    vectorField.height = fieldHeight;
    clearFrame();
};