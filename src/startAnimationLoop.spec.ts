import createMockRaf from 'mock-raf';
import {startAnimationLoopWithInjected} from "./startAnimationLoop";

describe('startAnimationLoop', () => {
  it('loops and can be cancelled', () => {
    const mockRaf = createMockRaf();

    const fn = jest.fn();

    const cancel = startAnimationLoopWithInjected({
      raf: mockRaf.raf,
      caf: mockRaf.cancel
    })(fn);

    mockRaf.step();
    expect(fn).toHaveBeenCalled();

    fn.mockReset();
    mockRaf.step();
    expect(fn).toHaveBeenCalled();

    cancel();

    fn.mockReset();
    mockRaf.step();
    expect(fn).not.toHaveBeenCalled();
  });
});