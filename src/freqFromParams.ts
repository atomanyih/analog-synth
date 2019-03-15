export const freqFromParams = ({freqExp: exp, freqFine: fine}) => {
  if(exp > 0) {
    const number = 100**exp;
    return number + fine *number/100
  }

  const number = 100**-exp;
  return 1/(number + fine* number/100)
};