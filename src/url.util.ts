import { useSearchParams } from "next/navigation";

export const generateCallbackParams = (callback: string): URLSearchParams => {
	const params = new URLSearchParams();
	params.set("callback", callback);
	return params;
};

export const getCurrentPageUrl = (): string => {
	return window.location.pathname + window.location.search;
};

export const useCallbackUrl = <T extends string>(defaultCallback: T): T => {
	const params = useSearchParams();
	const callback = params.get("callback") ?? defaultCallback;
	return callback as T;
};
