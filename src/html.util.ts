import { Num3 } from "./types.util";

export const applyOpacityToHTMLElement = (element: HTMLElement | null, opacity: number) => {
	if (element) {
		element.style.opacity = opacity.toString();
		element.style.pointerEvents = opacity > 0 ? "auto" : "none";
	}
};

export const applyScaleToHTMLElement = (element: HTMLElement | null, scale: number) => {
	if (element) {
		element.style.transform = `scale(${100 * scale}%)`;
	}
};

export const applyPositionToHTMLElement = (element: HTMLElement | null, position: Num3) => {
	if (element) {
		element.style.transform = `translate(${position[0]}px, ${position[1]}px)`;
	}
};

export const applyRotationToHTMLElement = (element: HTMLElement | null, rotation: number) => {
	if (element) {
		element.style.transform = `rotate(${rotation}deg)`;
	}
};
