// Add proper checks for browser environment
const isBrowser = typeof window !== "undefined";

export const waitFor = (test: () => boolean, cb?: () => void) => {
  if (!isBrowser) {
    return Promise.resolve();
  }

  let _resolve: () => void;
  //callback that is called every frame until test is satisfied
  const nextFrame = () => {
    if (!test()) {
      requestAnimationFrame(nextFrame);
    } else {
      cb?.();
      _resolve?.();
    }
  };

  //call next frame to find out if everything is ready

  return new Promise<void>((resolve) => {
    _resolve = resolve;
    nextFrame();
  });
};

export const waitForMs = (duration: number, cb?: () => void) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  }).then(() => {
    if (cb) {
      cb();
    }
  });
};
