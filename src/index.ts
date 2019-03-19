import startAnimationLoop from "./startAnimationLoop";
import Stats from 'stats-js';
import * as waves from "./Waves";

import * as dat from 'dat.gui';
import {freqFromParams} from "./freqFromParams";
import {createOscFolder, state} from "./Parameters";
import {getPast, saveImageData} from "./ThePast";
import {getCanvas} from "./getCanvas";
import {defaults} from './defaults';
import {saw, triangle} from "./Waves";

const otherParameters = {
  trailsAmount: 0,
  lfoDest: '',
  lfoAmount: 0.5,
  lfoFreq: 1
};

const gui = new dat.GUI({load: defaults});

gui.add(otherParameters, 'trailsAmount', 0, 1);

const {
  osc1Parameters, osc2Parameters, osc3Parameters,
} = state;

createOscFolder(gui, osc1Parameters, 'osc1');
createOscFolder(gui, osc2Parameters, 'osc2');
createOscFolder(gui, osc3Parameters, 'osc3');

gui.remember(osc1Parameters);
gui.remember(osc2Parameters);
gui.remember(osc3Parameters);

gui.add(otherParameters, 'lfoDest', Object.keys(osc1Parameters));
gui.add(otherParameters, 'lfoAmount', 0, 1);
gui.add(otherParameters, 'lfoFreq', -10, 4);

window.gui = gui;

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


const {
  ctx,
  width: canvasWidth,
  height: canvasHeight
} = getCanvas('canvas');

// eventually do transforms... but HOW? shader?
// create scaling thing
//

const blend = (a, b, amount) => {
  // return a + b * amount - amount * 255 // plus darker
  return a + b * amount // plus lighter
  // return a - b * amount;
  // return (Math.random() > amount) ? a : b
};

const blendPixel = ([r0, g0, b0], [r1, g1, b1], amount) => {
  // return [
  //   r0 + r1 * amount,
  //   g0 + g1 * amount,
  //   b0 + b1 * amount,
  // ]
  return [
    r0 + r1 * amount,
    g0 + g1 * amount,
    b0 + b1 * amount,
  ]
};

const dissolvePixel = (a, b, amount) => {
  if (amount == 0) {
    return a
  }
  return Math.random() > amount ? a : b
};

const oscillator = (wave, freq, modSetting) => (mod, t) => wave(freq, mod * modSetting, t);

const synth = (osc1, osc2, osc3, osc1Mod, t) => {
  const osc1Val = osc1(
    osc1Mod,
    t
  );
  const osc2Val = osc2(
    osc1Val,
    t
  );

  const osc3Val = osc3(
    osc2Val,
    t
  );

  return <[number, number, number]>[
    (osc1Val + 1) / 2 * 255 * osc1Parameters.mix,
    (osc2Val + 1) / 2 * 255 * osc2Parameters.mix,
    (osc3Val + 1) / 2 * 255 * osc3Parameters.mix
  ];
};

const dissolveTrails = dissolvePixel;

const trails = blendPixel;

function render(osc1, osc2, osc3, t, trailsAmount: number) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageData = ctx.createImageData(canvasWidth, canvasHeight);

  const data = imageData.data;

  const numPixels = data.length / 4;
  const timePerFrame = 1000 / 24;
  const timePerPixel = timePerFrame / numPixels;

  const currentPixel = Math.floor(t / timePerPixel) % numPixels;
  const frameStartTime = t - currentPixel * timePerPixel;


  for (let i = 0; i < data.length; i += 4) {
    const pastPixel: [number, number, number] = [getPast(i), getPast(i + 1), getPast(i + 2)];

    // if(i / 4 == currentPixel) {
    //   data[i] = 255;
    //   data[i + 1] =255;
    //   data[i + 2] = 255;
    //   data[i + 3] = 255
    // }
    // const adjustedT = i * timePerPixel;
    // const adjustedT = t + (i - currentPixel) * timePerPixel;
    const adjustedT = frameStartTime + i * timePerPixel;
    // if (i / 4 > currentPixel) {
    //   data[i] = pastPixel[0];
    //   data[i + 1] = pastPixel[1];
    //   data[i + 2] = pastPixel[2];
    //   data[i + 3] = 255;
    //   break
    // }

    // if((i/4) % canvasWidth > (i/(canvasHeight * 4))) {
    //   continue
    // }

    const synthOutput = synth(
      osc1,
      osc2,
      osc3,
      pastPixel[2] / 255,
      adjustedT,
    );
    const pixel = trails(
      synthOutput,
      pastPixel,
      trailsAmount
    );

    data[i] = pixel[0];
    data[i + 1] = pixel[1];
    data[i + 2] = pixel[2];
    data[i + 3] = 255
  }

  saveImageData(imageData);

  ctx.putImageData(imageData, 0, 0);
}

const cancel = startAnimationLoop((t) => {
  stats.begin();

  const {trailsAmount, lfoFreq} = otherParameters;

  const lfoVal = triangle(1 / (1000 ** -lfoFreq), 0, t);
  const modulatedVal = osc1Parameters[otherParameters.lfoDest];
  let osc1ParametersLfo = {
    ...osc1Parameters,
    [otherParameters.lfoDest]: modulatedVal + lfoVal * modulatedVal * otherParameters.lfoAmount
  };
  // osc1Parameters[otherParameters.lfoDest] = osc1Parameters[otherParameters.lfoDest] * lfoVal;

  const osc1Freq = freqFromParams(osc1ParametersLfo);
  const osc2Freq = freqFromParams(osc2Parameters);
  const osc3Freq = freqFromParams(osc3Parameters);

  const osc1Wave = waves[osc1Parameters.waveName];
  const osc2Wave = waves[osc2Parameters.waveName];
  const osc3Wave = waves[osc3Parameters.waveName];

  const osc1 = oscillator(osc1Wave, osc1Freq, osc1ParametersLfo.mod);
  const osc2 = oscillator(osc2Wave, osc2Freq, osc2Parameters.mod);
  const osc3 = oscillator(osc3Wave, osc3Freq, osc3Parameters.mod);


  render(osc1, osc2, osc3, t, trailsAmount);

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