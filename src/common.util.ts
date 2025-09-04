import { isFunction } from "lodash-es";
import { ForwardedRef } from "react";

export const nullFunction = () => {};

export type TryCatchOptions = {
  onError?: (err: any) => void;
  errorMessage?: string;
  showError?: boolean;
};

export const tryCatch = <T>(
  handler: () => T,
  { onError, errorMessage, showError = false }: TryCatchOptions = {}
) => {
  var err: Error | null = null;
  var result: T | null = null;

  try {
    result = handler();
  } catch (ierr: any) {
    err = ierr;
  }

  return Promise.resolve()
    .then(() => {
      if (err) {
        throw err;
      }

      return result;
    })
    .catch((err) => {
      if (isFunction(onError)) {
        onError(err);
      } else if (showError) {
        console.warn(err);
      }
    });
};

type ClassName = string | null | undefined | false;
export const classNames = (...args: ClassName[]): string => {
  return args.filter(Boolean).join(" ");
};

export const cn = classNames;

export const isProduction = process.env.NODE_ENV === "production";
export const isDevelopment = process.env.NODE_ENV === "development";

export const unwrapForwardedRef = <T>(ref: ForwardedRef<T> | T): T | null => {
  if (ref && typeof ref === "object" && ref.hasOwnProperty("current")) {
    // Access DOM element safely
    return (ref as React.RefObject<T>).current;
  }

  return null;
};
