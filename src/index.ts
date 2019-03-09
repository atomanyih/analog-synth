import startAnimationLoop from "./startAnimationLoop";
import Stats from 'stats-js';
import * as waves from "./Waves";

import * as dat from 'dat.gui';
import {freqFromParams} from "./freqFromParams";
import {createOscFolder, OscillatorParameters} from "./Parameters";
import {getPast, saveImageData} from "./ThePast";
import {getCanvas} from "./getCanvas";

const trailsParameters = {
  trailsAmount: 0
};

const gui = new dat.GUI({name: 'hello'});

gui.add(trailsParameters, 'trailsAmount', 0, 1);

const osc1Parameters: OscillatorParameters = createOscFolder(gui,'osc1');
const osc2Parameters: OscillatorParameters = createOscFolder(gui, 'osc2');
const osc3Parameters: OscillatorParameters = createOscFolder(gui, 'osc3');


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

// const blendPixel = (a, b, amount) => {
//   if (amount == 0) {
//     return a
//   }
//   return Math.random() > amount ? a : b
// };

const oscillator = (wave, freq) => (mod, t) => wave(freq, mod, t);

function synth(osc1, osc2, osc3, pastPixel: [number, number, number], t, trailsAmount: number) {
  const osc1Val = osc1(
    pastPixel[2] / 255 * osc1Parameters.mod,
    t
  );
  const osc2Val = osc2(
    osc1Val * osc2Parameters.mod,
    t
  );

  const osc3Val = osc3(
    osc2Val * osc3Parameters.mod,
    t
  );

  return blendPixel(
    [(osc1Val + 1) / 2 * 255 * osc1Parameters.mix, (osc2Val + 1) / 2 * 255 * osc2Parameters.mix, (osc3Val + 1) / 2 * 255 * osc3Parameters.mix],
    pastPixel,
    trailsAmount
  );
}

function render(t, osc1Wave, osc1Freq, osc2Wave, osc2Freq, osc3Wave, osc3Freq, trailsAmount: number) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageData = ctx.createImageData(canvasWidth, canvasHeight);

  const data = imageData.data;

  const timePerFrame = 1000 / 60;
  const timePerPixel = timePerFrame / data.length;

  const currentPixel = Math.floor(t / timePerPixel) % data.length;
  const osc1 = oscillator(osc1Wave, osc1Freq);
  const osc2 = oscillator(osc2Wave, osc2Freq);
  const osc3 = oscillator(osc3Wave, osc3Freq);

  for (let i = 0; i < data.length; i += 4) {
    const pastPixel: [number, number, number] = [getPast(i), getPast(i + 1), getPast(i + 2)];

    // if(i / 4 == currentPixel) {
    //   data[i] = 255;
    //   data[i + 1] =255;
    //   data[i + 2] = 255;
    //   data[i + 3] = 255
    // }
    const adjustedT = t + (i - currentPixel) * timePerPixel;

    const pixel = synth(
      osc1,
      osc2,
      osc3,
      pastPixel,
      adjustedT,
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

  const {trailsAmount} = trailsParameters;

  const osc1Freq = freqFromParams(osc1Parameters.freqExp, osc1Parameters.freqFine);
  const osc2Freq = freqFromParams(osc2Parameters.freqExp, osc2Parameters.freqFine);
  const osc3Freq = freqFromParams(osc3Parameters.freqExp, osc3Parameters.freqFine);

  const osc1Wave = waves[osc1Parameters.waveName];
  const osc2Wave = waves[osc2Parameters.waveName];
  const osc3Wave = waves[osc3Parameters.waveName];

  render(t, osc1Wave, osc1Freq, osc2Wave, osc2Freq, osc3Wave, osc3Freq, trailsAmount);

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