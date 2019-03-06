import startAnimationLoop from "./startAnimationLoop";
import Stats from 'stats-js';
import {saw, sin, square, triangle} from "./Waves";

import * as dat from 'dat.gui';
import createSynth from "./Synth";

const oscParameterDefinitions = {
  freqExp: {
    init: 0,
    min: -1,
    max: 5
  },
  freqFine: {
    init: 0,
    min: 0,
    max: 5
  },
  // sync: 0,
  // wave: 'sine',
  // pulseWidth: 0.5,
  // mix: 1,
  mod: {
    init: 0,
    min: 0,
    max: 1
  },
  mix: {
    init: 1,
    min: 0,
    max: 1
  }
};

const gui = new dat.GUI({name: 'hello'});

const createOscFolder = name => {
  const oscFolder = gui.addFolder(name);
  const oscParameters = {};

  Object.entries(oscParameterDefinitions).forEach(([paramName, paramDef]) => {
    oscParameters[paramName] = paramDef.init;
    oscFolder.add(oscParameters, paramName, paramDef.min, paramDef.max)
  });

  return oscParameters
};

const osc1Parameters = createOscFolder('osc1');
const osc2Parameters = createOscFolder('osc2');
const osc3Parameters = createOscFolder('osc3');


const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let prevImageDatas = [];

const saveImageData = (imageData) => {
  prevImageDatas.unshift(imageData);
  prevImageDatas = prevImageDatas.slice(0, 5);
};

const getPast = (i) => {
  let maybeImageData = prevImageDatas[1];
  if(maybeImageData) {
    return maybeImageData.data[i+2] / 255
  }
  return 0
};

// eventually do transforms... but HOW? shader?
// create scaling thing
//



const cancel = startAnimationLoop((t) => {
  stats.begin();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageData = ctx.createImageData(canvasWidth, canvasHeight);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let osc1Val = triangle(1 / 499, getPast(i) * osc1Parameters.mod, i + t / 10);
    let osc2Val = square(1 / 199, osc1Val * osc2Parameters.mod, i);
    let osc3Val = sin(1 / 501, osc2Val * osc3Parameters.mod, i);
    data[i] = (osc1Val + 1) / 2 * 255 * osc1Parameters.mix;
    data[i + 1] = (osc2Val + 1) / 2 * 255 * osc2Parameters.mix;
    data[i + 2] = (osc3Val + 1) / 2 * 255 * osc3Parameters.mix;
    data[i + 3] = 255
  }

  saveImageData(imageData);

  ctx.putImageData(imageData, 0, 0);

  stats.end();
});

if (module.hot) {
  module.hot.dispose(function () {
    console.log('cancelling animation frame');
    cancel();
    console.log('removing stats node');
    document.body.removeChild(stats.dom);
    console.log('removing dat');
    gui.destroy();
  })
}