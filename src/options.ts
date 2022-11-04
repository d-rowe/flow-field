import { GUI } from 'dat.gui';

type Options = {
    drawLines: boolean,
    fieldScale: number,
    friction: number,
    blending: number,
    noiseScale: number,
    particleAlpha: number,
    particleCount: number,
    particleSurvivalRate: number,
    particleMaxSpeed: number,
    particleMass: number,
    particleSize: number,
    flux: number,
};

const options: Options = {
    blending: 0.74,
    drawLines: false,
    fieldScale: 10,
    friction: 1,
    noiseScale: 0.003,
    particleAlpha: 1,
    particleCount: 10000,
    particleMass: 0.35,
    particleMaxSpeed: 200,
    particleSize: 1,
    particleSurvivalRate: 0.95,
    flux: 52,
};

updateFromUrlParams();

function updateFromUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((val, key) => {
        if (key in options) {
            if (key === 'drawLines') {
                options.drawLines = val === 'true';
            } else {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                options[key] = Number(val);
            }
        }
    });
}

export default options;

export function getUrlParams(): string {
    const params = Object.entries(options)
        .map(([key, val]) => [key, val.toString()]);
    return new URLSearchParams(params).toString();
}

const gui = new GUI();
const particleFolder = gui.addFolder('particle');
particleFolder.add(options, 'drawLines');
particleFolder.add(options, 'blending', 0, 1);
particleFolder.add(options, 'friction', 0, 1);
particleFolder.add(options, 'noiseScale', 0.001, 0.025);
particleFolder.add(options, 'flux', 0, 100);
particleFolder.add(options, 'particleAlpha', 0, 1);
particleFolder.add(options, 'particleCount', 0, 25000);
particleFolder.add(options, 'particleMass', 0.05, 5);
particleFolder.add(options, 'particleSize', 0.01, 10);
particleFolder.add(options, 'particleSurvivalRate', 0, 1);
particleFolder.open();
gui.add({
    copyUrl() {
        const urlParams = getUrlParams();
        const {location} = window;
        const url = `${location.origin}${location.pathname}`;
        navigator.clipboard.writeText(`${url}?${urlParams}`);
    }
}, 'copyUrl');
