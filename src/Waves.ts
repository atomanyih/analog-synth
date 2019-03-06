export interface Wave {
  (f: number, phi: number, t: number): number
}

const saw : Wave = (f, phi, t) => {
  return Math.abs(t * 2 * f + phi) % 2 - 1
};

const pulse = (width) => (f, phi, t) => {
  const cutoff = 1 - 2 * width;
  return saw(f, phi, t) > cutoff ? 1 : -1;
};

const square : Wave = pulse(0.5)

const sin : Wave = (f, phi, t) => {
  return Math.sin(2 * Math.PI * f * t  + 2 * Math.PI * phi)
};

const triangle : Wave = (f, phi, t) => {
  return 2 * Math.abs(saw(f, phi, t)) - 1
};

export {saw, square, sin, triangle}