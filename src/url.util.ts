// Make Next.js import optional
let useSearchParams: any = null;

try {
  const nextNavigation = require("next/navigation");
  useSearchParams = nextNavigation.useSearchParams;
} catch (e) {
  // Next.js not available
  console.warn("@jimib/ts-utils: Next.js not available");
}

// Add proper checks for browser environment
const isBrowser = typeof window !== "undefined";

export const generateCallbackParams = (callback: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.set("callback", callback);
  return params;
};

export const getCurrentPageUrl = (): string => {
  if (!isBrowser) return "";
  return window.location.pathname + window.location.search;
};

export const useCallbackUrl = <T extends string>(defaultCallback: T): T => {
  if (!useSearchParams) {
    console.warn(
      "@jimib/ts-utils: useSearchParams not available - Next.js not installed"
    );
    return defaultCallback;
  }

  const params = useSearchParams();
  const callback = params.get("callback") ?? defaultCallback;
  return callback as T;
};
