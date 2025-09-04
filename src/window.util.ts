"use client";

import { useCallback, useEffect, useState } from "react";
import { useListener, useRefState } from "./hook.util";

// Add proper checks for browser environment
export const isBrowser = typeof window !== "undefined";

export type WindowSize = {
  width: number;
  height: number;
};

export const getWindow = (): Window | null => (isBrowser ? window : null);

export const getWindowSize = () => {
  if (!isBrowser) {
    return { width: 0, height: 0 };
  }
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

export const useWindowSize = (callback: (size: WindowSize) => void) => {
  const handleResize = useCallback(() => {
    callback(getWindowSize());
  }, [callback]);

  useEffect(() => {
    if (!isBrowser) return;

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);
};

export type WindowFocusProps = {
  onFocus?: () => void;
  onBlur?: () => void;
};

export function useWindowFocus({ onFocus, onBlur }: WindowFocusProps = {}) {
  const [state] = useState({
    isFocused: false,
  });

  const [refState] = useRefState({
    onFocus,
    onBlur,
  });

  useListener(getWindow, ["focus", "blur"], (evt) => {
    state.isFocused = evt.type === "focus";
    if (state.isFocused) {
      refState.onFocus?.();
    } else {
      refState.onBlur?.();
    }
  });

  useEffect(() => {
    if (!isBrowser) return;
    state.isFocused = document.hasFocus();
  }, [state.isFocused]);
}
