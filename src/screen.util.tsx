import { useEffect } from "react";
import { useRefState } from "./hook.util";

// Add proper checks for browser environment
const isBrowser = typeof window !== "undefined";

export function supportsFullscreen() {
  if (!isBrowser) return false;

  const element = document.body as any;

  return (
    document.fullscreenEnabled ||
    element.webkitFullscreenEnabled ||
    element.mozFullScreenEnabled ||
    element.msFullscreenEnabled
  );
}

export function enterFullscreen(element?: HTMLElement) {
  if (!isBrowser || !supportsFullscreen()) {
    return;
  }

  if (!element) {
    element = document.body;
  }

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if ((element as any).webkitRequestFullscreen) {
    /* Safari */
    (element as any).webkitRequestFullscreen();
  } else if ((element as any).msRequestFullscreen) {
    /* IE11 */
    (element as any).msRequestFullscreen();
  }
}

// Exit fullscreen mode
export function exitFullscreen() {
  if (!isBrowser) return;

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    /* Safari */
    (document as any).webkitExitFullscreen();
  } else if ((document as any).msExitFullscreen) {
    /* IE11 */
    (document as any).msExitFullscreen();
  }
}

export interface ScreenProps {
  onBlur?(): void;
  onFocus?(): void;
}
export function useScreen({ onBlur, onFocus }: ScreenProps) {
  const [refState] = useRefState({ onBlur, onFocus });

  useEffect(() => {
    if (!isBrowser) return;

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        refState.onFocus?.();
      } else {
        refState.onBlur?.();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refState]);
  return null;
}

export function Screen({ ...props }: ScreenProps) {
  useScreen({ ...props });
  return null;
}
