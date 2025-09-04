"use client";

export function getDeviceInfo() {
	const deviceInfo = {
		userAgent: navigator.userAgent, // Complete user agent string
		deviceType: getDeviceType(), // Mobile, Tablet, or Desktop
		browser: getBrowserInfo(), // Browser name and version
		screenResolution: {
			width: window.screen.width,
			height: window.screen.height,
		},
		language: navigator.language, // Browser language
	};

	return deviceInfo;
}

// Determine device type (Mobile/Tablet/Desktop)
export function getDeviceType() {
	if (!navigator) {
		return "Unknown";
	}

	const ua = navigator.userAgent;
	if (/Mobi|Android/i.test(ua)) {
		return "Mobile";
	} else if (/Tablet|iPad/i.test(ua)) {
		return "Tablet";
	} else {
		return "Desktop";
	}
}

// Get browser information
export function getBrowserInfo() {
	if (!navigator) {
		return null;
	}

	const ua = navigator.userAgent || "";
	let browserName = "Unknown";
	let browserVersion = "";

	const matchAgent = (regex: RegExp, index: number) => (ua.match(regex) || [])[index] || "";

	if (/chrome|chromium|crios/i.test(ua)) {
		browserName = "Chrome";
		browserVersion = matchAgent(/(?:chrome|crios|chromium)\/([\w\.]+)/i, 2);
	} else if (/firefox|fxios/i.test(ua)) {
		browserName = "Firefox";
		browserVersion = matchAgent(/(firefox|fxios)\/(\d+)/i, 2);
	} else if (/safari/i.test(ua) && !/chrome|chromium|crios/i.test(ua)) {
		browserName = "Safari";
		browserVersion = matchAgent(/version\/(\d+)/i, 1);
	} else if (/opr\/|opera/i.test(ua)) {
		browserName = "Opera";
		browserVersion = matchAgent(/(opr|opera)\/(\d+)/i, 2);
	} else if (/edg/i.test(ua)) {
		browserName = "Edge";
		browserVersion = matchAgent(/edg\/(\d+)/i, 1);
	} else if (/trident/i.test(ua)) {
		browserName = "Internet Explorer";
		browserVersion = matchAgent(/rv:(\d+)/i, 1);
	}

	return {
		name: browserName,
		version: browserVersion,
	};
}
