export interface Wave {
  (f: number, phi: number, t: number): number
}

// https://github.com/netcell/FTrig
const sinLow = x => {
  x = x%(2*3.14159265) - 3.14159265;
  if (x < -3.14159265) x += 6.28318531;
  else if (x >  3.14159265) x -= 6.28318531;
  if (x < 0) return 1.27323954 * x + .405284735 * x * x;
  else return 1.27323954 * x - 0.405284735 * x * x;
};

const saw : Wave = (f, phi, t) => {
  return Math.abs(t * 2 * f + phi) % 2 - 1
};

const pulse = (width) => (f, phi, t) => {
  const cutoff = 1 - 2 * width;
  return saw(f, phi, t) > cutoff ? 1 : -1;
};

const square : Wave = pulse(0.5);

const sin : Wave = (f, phi, t) => {
  return sinLow(2 * Math.PI * f * t  + 2 * Math.PI * phi)
};

const triangle : Wave = (f, phi, t) => {
  return 2 * Math.abs(saw(f, phi, t)) - 1
};

export {saw, square, sin, triangle, pulse}