import startAnimationLoop from "./startAnimationLoop";
import Stats from 'stats-js';
import {saw, sin, square, triangle} from "./Waves";

import * as dat from 'dat.gui';
import {freqFromParams} from "./freqFromParams";

interface ParameterDefinition {
  init: number,
  min: number,
  max: number
}

interface OscillatorParameters {
  freqExp: number,
  freqFine: number,
  mod: number,
  mix: number
}

const oscParameterDefinitions = {
  freqExp: <ParameterDefinition>{
    init: 0,
    min: -3,
    max: 2
  },
  freqFine: <ParameterDefinition>{
    init: 0,
    min: 0,
    max: 100
  },
  // sync: 0,
  // wave: 'sine',
  // pulseWidth: 0.5,
  // mix: 1,
  mod: <ParameterDefinition>{
    init: 0,
    min: 0,
    max: 1
  },
  mix: <ParameterDefinition>{
    init: 1,
    min: 0,
    max: 1
  }
};

const gui = new dat.GUI({name: 'hello'});

const createOscFolder : (name:string) => OscillatorParameters = name => {
  const oscFolder = gui.addFolder(name);
  const oscParameters = {};

  Object.entries(oscParameterDefinitions).forEach(([paramName, paramDef]) => {
    oscParameters[paramName] = paramDef.init;
    oscFolder.add(oscParameters, paramName, paramDef.min, paramDef.max)
  });

  // is this sketch?
  return <OscillatorParameters> oscParameters
};

const osc1Parameters : OscillatorParameters = createOscFolder('osc1');
const osc2Parameters : OscillatorParameters = createOscFolder('osc2');
const osc3Parameters : OscillatorParameters = createOscFolder('osc3');


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
  if (maybeImageData) {
    return maybeImageData.data[i + 2] / 255
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

  const osc1Freq = freqFromParams(osc1Parameters.freqExp, osc1Parameters.freqFine);
  const osc2Freq = freqFromParams(osc2Parameters.freqExp, osc2Parameters.freqFine);
  const osc3Freq = freqFromParams(osc3Parameters.freqExp, osc3Parameters.freqFine);

  for (let i = 0; i < data.length; i += 4) {
    const osc1Val = triangle(
      osc1Freq,
      getPast(i) * osc1Parameters.mod,
      i + t / 10
    );
    const osc2Val = square(
      osc2Freq,
      osc1Val * osc2Parameters.mod,
      i
    );

    const osc3Val = triangle(
      osc3Freq,
      osc2Val * osc3Parameters.mod,
      i
    );
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