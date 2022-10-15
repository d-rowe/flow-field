import { GUI } from 'dat.gui';

type Options = {
    fieldScale: number,
    frameAlpha: number,
    noiseScale: number,
    particleAlpha: number,
    particleCount: number,
    particleLifeSpan: number,
    particleSize: number,
    timeNoiseScale: number,
};

const options: Options = {
    fieldScale: 10,
    frameAlpha: 0.02,
    noiseScale: 0.005,
    particleAlpha: 0.5,
    particleCount: 10000,
    particleLifeSpan: 0.97,
    particleSize: 1,
    timeNoiseScale: 0.00001,
};

updateFromUrlParams();

function updateFromUrlParams() {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.forEach((val, key) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options[key] = Number(val);
    });
}

export default options;

export function getUrlParams(): string {
    const params = Object.entries(options)
        .map(([key, val]) => [key, val.toString()]);
    return new URLSearchParams(params).toString();
}

const gui = new GUI();
const settingsFolder = gui.addFolder('Settings');
settingsFolder.add(options, 'fieldScale', 1, 50);
settingsFolder.add(options, 'frameAlpha', 0, 1);
settingsFolder.add(options, 'particleAlpha', 0, 1);
settingsFolder.add(options, 'particleCount', 0, 25000);
settingsFolder.add(options, 'particleSize', 0.01, 10);
settingsFolder.add(options, 'particleLifeSpan', 0, 1);
settingsFolder.add(options, 'noiseScale', 0.001, 0.025);
settingsFolder.add(options, 'timeNoiseScale', 0, 0.00005);
settingsFolder.open();
gui.add({
    copyUrl() {
        const urlParams = getUrlParams();
        const {location} = window;
        const url = `${location.origin}${location.pathname}`;
        navigator.clipboard.writeText(`${url}?${urlParams}`);
    }
}, 'copyUrl');