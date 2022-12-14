import Particle from './Particle';
import VectorField from "./VectorField";
import options from './options';

const container = document.getElementById('root');
if (!container) {
    throw new Error('No container');
}

const { width: pageWidth, height: pageHeight } = container.getBoundingClientRect();
let width = pageWidth * devicePixelRatio;
let height = pageHeight * devicePixelRatio;
const canvas = createCanvas();
container.append(canvas);
const ctx = canvas.getContext('2d', { alpha: false })!;
let fieldWidth = width / options.fieldScale;
let fieldHeight = height / options.fieldScale;
const vectorField = new VectorField(fieldWidth, fieldHeight);
const particles: Particle[] = [];

requestAnimationFrame(animate);

function animate(time: number) {
    vectorField.update(time, options.noiseScale, options.flux / 2000000);
    clearFrame();
    updateParticles();
    requestAnimationFrame(animate);
}

function updateParticles() {
    // ensure we have the right number of particles
    const particleFillCount = options.particleCount - particles.length;
    if (particleFillCount < 0) {
        const particlesToRemove = -particleFillCount;
        particles.splice(particles.length - particlesToRemove, particlesToRemove);
    }
    for (let i = 0; i < particleFillCount; i++) {
        particles.push(new Particle(
            ctx,
            Math.random() * width,
            Math.random() * height,
        ));
    }

    // update particle positions
    particles.forEach(particle => {
        if (Math.random() > options.particleSurvivalRate) {
            resetParticle(particle);
        }
        const fieldX = Math.floor(particle.x / options.fieldScale);
        const fieldY = Math.floor(particle.y / options.fieldScale);
        const vector = vectorField.getVector(fieldX, fieldY);
        if (vector) {
            particle.move(vector.x, vector.y);
        } else {
            resetParticle(particle);
        }
        particle.draw();
    });
}

function resetParticle(particle: Particle) {
    const x = Math.random() * width;
    const y= Math.random() * height;
    particle.lastX = x;
    particle.lastY = y;
    particle.x = x;
    particle.y = y;
}

function clearFrame() {
    ctx.fillStyle = `rgba(0, 0, 0, ${1 - options.blending})`;
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
    fieldWidth = width / options.fieldScale;
    fieldHeight = height / options.fieldScale;
    vectorField.width = fieldWidth;
    vectorField.height = fieldHeight;
    clearFrame();
};
