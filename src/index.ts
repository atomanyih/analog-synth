import startAnimationLoop from "./startAnimationLoop";
import Stats from 'stats-js';
import {saw, sin, square, triangle} from "./Waves";

const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


const canvas = <HTMLCanvasElement>document.getElementById('canvas');
const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const cancel = startAnimationLoop((t) => {
  stats.begin();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const imageData = ctx.createImageData(canvasWidth, canvasHeight);

  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let osc1Val = triangle(1 / 503, 0, i + t);
    let osc2Val = square(1 / 200, osc1Val, i + t);
    let osc3Val = square(1 / 501, osc2Val * 0.5, i);
    // data[i] = (osc1Val + 1) / 2 * 255;
    // data[i + 1] = (osc2Val + 1) / 2 * 255;
    data[i + 2] = (osc3Val + 1) / 2 * 255;
    data[i + 3] = 255
  }

  ctx.putImageData(imageData, 0, 0);

  stats.end();
});

if (module.hot) {
  module.hot.dispose(function () {
    console.log('cancelling animation frame');
    cancel();
    console.log('removing stats node');
    document.body.removeChild(stats.dom);
  })
}