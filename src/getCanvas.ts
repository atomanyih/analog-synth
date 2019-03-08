const getCanvas = (id) => {
  const canvas = <HTMLCanvasElement>document.getElementById(id);
  const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;

  return {
    ctx,
    width: canvasWidth,
    height: canvasHeight
  }
};

export {getCanvas};