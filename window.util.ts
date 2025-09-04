"use client";

import { useCallback, useEffect, useState } from "react";
import { useListener, useRefState } from "./hook.util";

export type WindowSize = {
	width: number;
	height: number;
};

export const getWindow = (): Window | null => (typeof window !== "undefined" ? window : null);

export const getWindowSize = () => {
	return {
		width: getWindow()?.innerWidth ?? 0,
		height: getWindow()?.innerHeight ?? 0,
	};
};

export const useWindowSize = (callback: (size: WindowSize) => void) => {
	const handleResize = useCallback(() => {
		callback(getWindowSize());
	}, [callback]);

	useEffect(() => {
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
		state.isFocused = document.hasFocus();
	}, [state.isFocused]);
}
