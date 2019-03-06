export interface Wave {
  (t: number): number
}

export interface WaveConstructor {
  (f: number, phi: number): Wave
}

const saw : WaveConstructor = (f, phi) => (t) => {
  const a = 1 / f;
  return 2 * ((t + phi) / a - Math.floor(0.5 + (t + phi) / a));
};

const square : WaveConstructor = (f, phi) => (t) => {
  return 2 * (2 * Math.floor(f * (t + phi)) - Math.floor(2 * f * (t + phi))) + 1
};

const sin : WaveConstructor = (f, phi) => (t) => {
  return Math.sin(2 * Math.PI * f * (t + phi))
};

const triangle : WaveConstructor = (f, phi) => (t) => {
  return 2 * Math.abs(saw(f, phi)(t)) - 1
};

export {saw, square, sin, triangle}