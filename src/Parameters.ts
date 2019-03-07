export type ParameterDefinition = NumberParameterDefinition | SelectParameterDefinition

export type NumberParameterDefinition = {
  init: number,
  min: number,
  max: number
}

export type SelectParameterDefinition = {
  init: string,
  options: string[]
}

export type OscillatorParameters = {
  freqExp: number,
  freqFine: number,
  mod: number,
  mix: number,
  waveName: string
  // sync: number
}

export const oscParameterDefinitions : {[paramName : string] : ParameterDefinition} = {
  freqExp: {
    init: -1.8,
    min: -3,
    max: 4
  },
  freqFine: {
    init: 0,
    min: 0,
    max: 100
  },
  // sync: {
  //   init: 0,
  //   min: 0,
  //   max: 1
  // },
  // wave: 'sine',
  // pulseWidth: 0.5,
  // mix: 1,
  mod: {
    init: 0,
    min: 0,
    max: 1
  },
  mix: {
    init: 1,
    min: 0,
    max: 1
  },
  waveName: {
    init: 'triangle',
    options: ['sin', 'square', 'saw', 'triangle']
  }
};