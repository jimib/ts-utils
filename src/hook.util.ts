import each from "lodash-es/each";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isDevelopment } from "./common.util";
import { mix } from "./math.util";
import { nullify } from "./types.util";

export const useRefState = <T extends object>(
  initialValue: T
): [T /*,React.Dispatch<React.SetStateAction<T>>*/] => {
  const [state, setState] = useState<T>(initialValue);

  each(initialValue, (value, id) => {
    if (id !== "id") {
      (state as any)[id] = (initialValue as any)[id];
    }
  });

  return [state];
};

export type BasicEvent = {
  type: string;
  target?: string;
  value?: any;
};

export type BasicEventListener = (evt: BasicEvent) => void;

export type BasicEventDispatcher = {
  dispatch(evt: BasicEvent): void;
  on(type: string, callback: BasicEventListener): () => void;
  off(type: string, callback: BasicEventListener): void;
};

export const useBasicEventDispatcher = (): BasicEventDispatcher => {
  const [state] = useState(() => ({
    listeners: new Map<string, BasicEventListener[]>(),
  }));

  return useMemo(() => {
    const methods = {
      dispatch(evt: BasicEvent) {
        const listeners = state.listeners.get(evt.type) ?? [];
        listeners.forEach((listener) => {
          listener(evt);
        });
      },
      on(type: string, callback: BasicEventListener) {
        if (!state.listeners.has(type)) {
          state.listeners.set(type, []);
        }
        state.listeners.get(type)?.push(callback);

        return () => {
          methods.off(type, callback);
        };
      },
      off(type: string, callback: BasicEventListener) {
        var listeners = state.listeners.get(type) ?? [];
        state.listeners.set(
          type,
          listeners.filter((item) => item !== callback)
        );
      },
    };
    return methods;
  }, [state]);
};

export const useAnimationFrame = (
  onUpdate: ({}, dt: number) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    var isRunning = true;
    var timeLastFrame = Date.now();

    const update = () => {
      if (isRunning) {
        const dt = 0.001 * (Date.now() - timeLastFrame);
        timeLastFrame = Date.now();
        onUpdate({}, dt);
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);

    return () => {
      isRunning = false;
    };
  }, [onUpdate.toString(), ...deps]);
};

export const useInterval = (
  onUpdate: ({}, dt: number) => void,
  duration: number = 1000,
  deps: any[] = []
) => {
  const [state] = useState({
    running: false,
  });

  useEffect(() => {
    if (duration <= 0) return;

    if (state.running) return;

    state.running = true;

    var timeLastFrame = Date.now();

    const update = () => {
      const dt = 0.001 * (Date.now() - timeLastFrame);
      timeLastFrame = Date.now();
      onUpdate({}, dt);
    };

    const interval = setInterval(update, duration);

    return () => {
      clearInterval(interval);
      state.running = false;
    };
  }, [onUpdate.toString(), duration, ...deps]);
};

export const useForceUpdate = () => {
  const [tick, setTick] = useState(0);
  return useCallback(() => setTick((tick) => tick + 1), []);
};

export const useDebugRenderCount = (label: string) => {
  const [state] = useState({
    count: 0,
  });

  if (isDevelopment) {
    console.log(`debugRenderCount:\n\t${label}`, ++state.count);
  }
};

type HookFn = () => void;
export const unhookAll = (...hooks: HookFn[] | HookFn[][]): HookFn => {
  return () => {
    hooks.forEach((hook) => {
      if (Array.isArray(hook)) {
        hook.forEach((h) => h());
      } else {
        hook();
      }
    });
  };
};

interface FadeOptions {
  duration?: number;
  onUpdate?(value: number, options: { progress: number; time: number }): void;
  onComplete?(options: { progress: number; time: number }): void;
}
interface FadeInAndOutOptions extends FadeOptions {
  defaultValue?: number;
}

interface FadeInAndOutMethods {
  fadeTo(opacity: number, options?: FadeOptions): Promise<null>;
  fadeIn(options?: FadeOptions): Promise<null>;
  fadeOut(options?: FadeOptions): Promise<null>;
  getValue(): number;
}

export const useFadeInAndOut = ({
  defaultValue = 1,
  duration = 1,
  onUpdate,
  onComplete,
}: FadeInAndOutOptions = {}): FadeInAndOutMethods => {
  const [state] = useState(() => ({
    value: defaultValue,
    currentAnimation: null as any,
  }));

  return useMemo(() => {
    const methods = {
      fadeTo: (value: number, options: any = {}) => {
        const startOpacity = state.value;
        const endOpacity = value;

        state.currentAnimation?.stop();

        return new Promise<null>((resolve) => {
          // Simple animation implementation without external dependency
          const startTime = Date.now();
          const animDuration =
            (options.duration ?? duration) *
            Math.abs(endOpacity - startOpacity);

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / animDuration, 1);

            state.value = mix(startOpacity, endOpacity, progress);
            onUpdate?.(state.value, { progress, time: elapsed });
            options.onUpdate?.(state.value, { progress, time: elapsed });

            if (progress < 1) {
              state.currentAnimation = requestAnimationFrame(animate);
            } else {
              state.value = endOpacity;
              onUpdate?.(state.value, { progress: 1, time: elapsed });
              options.onUpdate?.(state.value, { progress: 1, time: elapsed });
              onComplete?.({ progress: 1, time: elapsed });
              options.onComplete?.({ progress: 1, time: elapsed });
              resolve(null);
            }
          };

          state.currentAnimation = requestAnimationFrame(animate);
        });
      },
      fadeIn: (options: FadeOptions) => methods.fadeTo(1, options),
      fadeOut: (options: FadeOptions) => methods.fadeTo(0, options),
      getValue: () => state.value,
    };

    return methods;
  }, [state]);
};

export const useListener = (
  target: EventTarget | (() => EventTarget | null),
  event: string | string[],
  callback: (evt: Event) => void
) => {
  useEffect(() => {
    const itarget = typeof target === "function" ? target() : target;

    if (Array.isArray(event)) {
      event.forEach((e) => itarget?.addEventListener(e, callback));
    } else {
      itarget?.addEventListener(event, callback);
    }

    return () => {
      if (Array.isArray(event)) {
        event.forEach((e) => itarget?.removeEventListener(e, callback));
      } else {
        itarget?.removeEventListener(event, callback);
      }
    };
  }, [target, event, callback]);
};

export const useHydratedStore = <T, F>(
  store: (callback: (state: T) => unknown) => unknown,
  callback: (state: T) => F
) => {
  const result = store(callback) as F;
  const [data, setData] = useState<F>();

  useEffect(() => {
    setData(result);
  }, [result]);

  return data;
};
