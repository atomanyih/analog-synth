export type OscillatorParameters = {
  freqExp: number,
  freqFine: number,
  freqExtraFine: number,
  mod: number,
  mix: number,
  waveName: string
}

const createOscParameters = () => ({
  freqExp: -1.8,
  freqFine: 0,
  freqExtraFine: 0,
  mod: 0,
  mix: 1,
  waveName: 'triangle',
});

export const state = {
  osc1Parameters: createOscParameters(),
  osc2Parameters: createOscParameters(),
  osc3Parameters: createOscParameters(),
};

export const createOscFolder: (gui, OscillatorParameters, name: string) => void = (gui, oscParameters, name) => {
  const oscFolder = gui.addFolder(name);

  oscFolder.add(oscParameters, 'freqExp', -3, 4);
  oscFolder.add(oscParameters, 'freqFine', -50, 50);
  oscFolder.add(oscParameters, 'freqExtraFine', -50, 50);
  oscFolder.add(oscParameters, 'mod', 0, 1);
  oscFolder.add(oscParameters, 'mix', 0, 1);
  oscFolder.add(oscParameters, 'waveName', ['sin', 'square', 'saw', 'triangle']);
};