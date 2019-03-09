import {saw, sin, triangle, square, Wave} from "../Waves";

const nodesToRemove = [];

function renderGraph(wave: Wave, name: string) {
  const canvas = document.createElement('canvas');
  const canvasWidth = 500;
  const canvasHeight = 100;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  const div = document.createElement('div');
  div.appendChild(canvas);
  div.appendChild(document.createTextNode(name));

  document.body.appendChild(div);

  nodesToRemove.push(div);

  ctx.save();
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.translate(0.5, canvasHeight / 2 + 0.5);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(canvasWidth, 0);
  ctx.moveTo(0, canvasHeight / 2);
  ctx.lineTo(0, -canvasHeight / 2);
  ctx.stroke();


  const period = 100;
  const frequency = 1 / period;
  const yScale = (canvasHeight - 4) / 2;

  for (let t = 0; t < canvasWidth; t++) {
    if (t % period === 0) {
      ctx.beginPath();
      ctx.moveTo(t, -5);
      ctx.lineTo(t, 5);
      ctx.stroke();
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(t, wave(frequency, 0, t) * yScale, 1, 1);
  }

  ctx.restore();
}

renderGraph(sin, 'sin');
renderGraph(saw, 'saw');
renderGraph(triangle, 'triangle');
renderGraph(square, 'square');

renderGraph((f, phi, t) => {
  const tc = 170;
  const f1 = f * 2;
  const phi1 = f * tc + phi - f1 * tc;
  const wave = sin;
  return t < tc ? wave(f, phi, t) : wave(f1, phi1, t)
}, 'intersect sin');

renderGraph((f, phi, t) => {
  const tc = 170;
  const f1 = f * 2;
  const phi1 = 2* f * tc + phi - 2 * f1 * tc;
  const wave = saw;
  return t < tc ? wave(f, phi, t) : wave(f1, phi1, t)
}, 'intersect saw');


if (module.hot) {
  module.hot.dispose(function () {
    console.log('cleaning up');
    nodesToRemove.forEach(node => document.body.removeChild(node));
  })
}