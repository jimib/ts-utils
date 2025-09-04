import {
  forwardRef,
  memo,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { useRefState } from "./hook.util";

export type DataRendererMethods<T> = {
  setData: (data: T | null) => void;
  mergeData: (data: Partial<T>) => void;
  getData: () => T | null;
};

type DataRendererProps<T> = {
  defaultData: T | null;
  children: (data: T) => React.ReactNode;
  debug?: boolean;
};

export const DataRenderer = memo(
  forwardRef(
    <T extends object>(
      { children, defaultData, debug = false }: DataRendererProps<T>,
      ref: React.ForwardedRef<DataRendererMethods<T>>
    ) => {
      const [data, setData] = useState<T | null>(defaultData);

      if (debug) {
        console.log("data", data, defaultData);
      }

      const [state] = useRefState({
        data,
      });
      const methods = useMemo(() => {
        return {
          setData: (data: T | null) => {
            if (debug) {
              console.log("setData", data);
            }
            state.data = data;
            setData(state.data);
          },
          mergeData: (data: Partial<T>) => {
            if (debug) {
              console.log("mergeData", data);
            }
            // only able to merge data if there is already data
            if (!state.data) return;
            state.data = { ...(state.data as T), ...data };
            setData(state.data);
          },
          getData: () => {
            if (debug) {
              console.log("getData", state.data);
            }
            return state.data;
          },
        };
      }, [state]);

      useImperativeHandle(ref, () => methods);

      if (!data) return null;
      return children(data);
    }
  )
) as <T extends object>(
  props: DataRendererProps<T> & {
    ref?: React.ForwardedRef<DataRendererMethods<T>>;
  }
) => React.ReactElement;
