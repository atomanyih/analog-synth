const startAnimationLoopWithInjected = ({raf, caf}) => (fn : (t: number) => void) => {
  let handle: number;

  const animate = (t) => {
    fn(t);

    handle = raf(animate);
  };

  handle = raf(animate);

  const cancel = () => {
    caf(handle);
  };

  return cancel;
};

const startAnimationLoop = startAnimationLoopWithInjected({
  raf: requestAnimationFrame,
  caf: cancelAnimationFrame
});

export {startAnimationLoopWithInjected};
export default startAnimationLoop;