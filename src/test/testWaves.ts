import {getCanvas} from "../getCanvas";
import {saw, sin, triangle, square, Wave} from "../Waves";

function renderGraph(wave: Wave, canvasId: string) {

  const {
    ctx,
    width: canvasWidth,
    height: canvasHeight
  } = getCanvas(canvasId);

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

