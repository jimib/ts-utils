import isFunction from "lodash-es/isFunction";
import { nullFunction, tryCatch } from "./common.util";
import { factorIn } from "./math.util";
import { ComponentType, RefObject } from "react";
import { delay } from "./promise.util";

export type PlayAnimationStateOptions = {
  progress: number;
  time: number;
};

export type PlayAnimationArgs = {
  duration: number;
  timestamps?: { [key: number]: (() => void) | null };
  onUpdate?: (state: PlayAnimationStateOptions) => void;
  onComplete?: (state: PlayAnimationStateOptions) => void;
};

export type PlayAnimationResult = {
  stop: () => void;
};

export const playAnimation = ({
  duration = 1,
  timestamps = {},
  onUpdate = nullFunction,
  onComplete = nullFunction,
}: PlayAnimationArgs): PlayAnimationResult => {
  const timeStart: number = Date.now();

  var isRunning: boolean = true;

  const update = () => {
    if (!isRunning) {
      return;
    }

    const time: number = 0.001 * (Date.now() - timeStart);

    const progress = duration === 0 ? 1 : factorIn(time, 0, duration);

    tryCatch(() =>
      onUpdate?.({
        progress,
        time,
      })
    );

    const keys: number[] = Object.keys(timestamps).map((item) => Number(item));

    keys.forEach((key) => {
      const value = timestamps[key];

      if (value && isFunction(value)) {
        if (progress >= key) {
          // remove reference
          timestamps[key] = null;
          // try to action it
          tryCatch(value);
        }
      }
    });

    // request the animation frame first
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      tryCatch(() =>
        onComplete?.({
          progress: 1,
          time,
        })
      );
    }
  };

  requestAnimationFrame(update);

  return {
    stop: () => {
      //stop the animation
      isRunning = false;
    },
  };
};

export type AnimationItem = {
  delay?: number;
  duration: number;
  timestamps?: { [key: number]: (() => void) | null };
  onStart?: (
    state: { progress: number; time: number },
    context: AnimationContext
  ) => void;
  onUpdate?: (
    state: { progress: number; time: number },
    context: AnimationContext
  ) => void;
  onComplete?: (
    state: { progress: number; time: number },
    context: AnimationContext
  ) => void;
};

export type AnimationElement = {
  id: string;
  component: ComponentType<any>;
  props?: Record<string, any>;
  ref?: RefObject<any>;
};

export type AnimationPromise = {
  delay?: number;
  promise: (context: AnimationContext) => Promise<void>;
};

export type AnimationCallback = {
  delay?: number;
  callback: (callback: () => void, context: AnimationContext) => void;
};

export type AnimationSequence = {
  parallel?: boolean;
  items: (
    | AnimationItem
    | AnimationSequence
    | AnimationPromise
    | AnimationCallback
  )[];
  onStart?: (context: AnimationContext) => void;
  onComplete?: (context: AnimationContext) => void;
};

export type AnimationContext = {
  elements: Map<string, AnimationElement>;
};

const DEFAULT_CONTEXT: AnimationContext = {
  elements: new Map(),
};

export const playItem = async (
  item: AnimationItem,
  context?: AnimationContext
) => {
  if (item.delay) {
    await delay(1000 * item.delay);
  }

  return new Promise<void>((resolve) => {
    item.onStart?.({ progress: 0, time: 0 }, context ?? DEFAULT_CONTEXT);
    playAnimation({
      duration: item.duration,
      onUpdate: (params) => item.onUpdate?.(params, context ?? DEFAULT_CONTEXT),
      onComplete: (params) => {
        item.onComplete?.(params, context ?? DEFAULT_CONTEXT);
        resolve();
      },
    });
  });
};

export const playPromise = async (
  item: AnimationPromise,
  context?: AnimationContext
) => {
  if (item.delay) {
    await delay(1000 * item.delay);
  }
  return await item.promise(context ?? DEFAULT_CONTEXT);
};

export const playCallback = async (
  item: AnimationCallback,
  context?: AnimationContext
) => {
  if (item.delay) {
    await delay(1000 * item.delay);
  }
  return await new Promise<void>((resolve) =>
    item.callback(resolve, context ?? DEFAULT_CONTEXT)
  );
};

const isAnimationSequence = (
  item: AnimationItem | AnimationSequence | AnimationPromise | AnimationCallback
): item is AnimationSequence => {
  return "items" in item;
};

const isAnimationPromise = (
  item: AnimationItem | AnimationSequence | AnimationPromise | AnimationCallback
): item is AnimationPromise => {
  return "promise" in item;
};

const isAnimationCallback = (
  item: AnimationItem | AnimationSequence | AnimationPromise | AnimationCallback
): item is AnimationCallback => {
  return "callback" in item;
};

const playItemOrSequence = async (
  item:
    | AnimationItem
    | AnimationSequence
    | AnimationPromise
    | AnimationCallback,
  context?: AnimationContext
) => {
  if (isAnimationSequence(item)) {
    await playSequence(item, context ?? DEFAULT_CONTEXT);
  } else if (isAnimationPromise(item)) {
    await playPromise(item, context ?? DEFAULT_CONTEXT);
  } else if (isAnimationCallback(item)) {
    await playCallback(item, context ?? DEFAULT_CONTEXT);
  } else {
    await playItem(item, context ?? DEFAULT_CONTEXT);
  }
};

export const playSequence = async (
  sequence: AnimationSequence,
  context?: AnimationContext
) => {
  tryCatch(() => sequence.onStart?.(context ?? DEFAULT_CONTEXT));
  if (sequence.parallel === true) {
    await Promise.all(
      sequence.items.map((item) =>
        playItemOrSequence(item, context ?? DEFAULT_CONTEXT)
      )
    );
  } else {
    for (const item of sequence.items) {
      await playItemOrSequence(item, context ?? DEFAULT_CONTEXT);
    }
  }
  tryCatch(() => sequence.onComplete?.(context ?? DEFAULT_CONTEXT));
};
