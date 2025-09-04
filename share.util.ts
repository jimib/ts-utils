"use client";

import _get from "lodash-es/get";
import _isFunction from "lodash-es/isFunction";

export const canShare = (data: any) => {
	return Promise.resolve().then(() => {
		return _isFunction(_get(window, "navigator.canShare")) ? window.navigator.canShare(data) : false;
	});
};

export const share = ({ url, title, text, files }: { url: string; title?: string; text?: string; files?: File[] }) => {
	var data = { url, title, text, files };

	return canShare(data).then((boolCanShare) => {
		if (boolCanShare) {
			try {
				window.navigator.share(data);
			} catch (error) {
				console.error(error);
			}
		} else {
			// copy to clipboard
			navigator.clipboard.writeText(url);
			alert("Copied to clipboard");
		}
	});
};

export const toBlob = (data: string, type: string) => {
	var blob = new Blob([data], { type });
	return blob;
};

export const dataURLtoFile = (dataurl: string, filename: string) => {
	var arr = dataurl.split(","),
		mime = arr[0]!.match(/:(.*?);/)![1],
		bstr = atob(arr[arr.length - 1]!),
		n = bstr.length,
		u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
};
