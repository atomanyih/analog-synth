import {freqFromParams} from "./freqFromParams";

describe('freqFromParams', () => {
  it('uses fine', () => {
    expect(freqFromParams(1, 2)).toEqual(102);
  });

  it('at higher exp, fine is larger', () => {
    expect(freqFromParams(2, 2)).toEqual(10200);
  });

  it('uses fine as denominator when exp is less than zero', () => {
    expect(freqFromParams(-2, 2)).toEqual(1/10200)
  });
});