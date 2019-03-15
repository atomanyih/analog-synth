export type OscillatorParameters = {
  freqExp: number,
  freqFine: number,
  freqExtraFine: number,
  mod: number,
  mix: number,
  waveName: string
  // sync: number
}

export const createOscFolder: (gui, name: string) => OscillatorParameters = (gui, name) => {
  const oscFolder = gui.addFolder(name);
  const oscParameters = {
    freqExp: -1.8,
    freqFine: 0,
    freqExtraFine: 0,
    mod: 0,
    mix:  1,
    waveName: 'triangle',
  };

  oscFolder.add(oscParameters, 'freqExp', -3, 4);
  oscFolder.add(oscParameters, 'freqFine', -50, 50);
  oscFolder.add(oscParameters, 'freqExtraFine', -50, 50);
  oscFolder.add(oscParameters, 'mod', 0, 1);
  oscFolder.add(oscParameters, 'mix', 0, 1);
  oscFolder.add(oscParameters, 'waveName', ['sin', 'square', 'saw', 'triangle']);

  return <OscillatorParameters>oscParameters
};