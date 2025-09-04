export const apiOptionsPost = (body?: any) => {
	return {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body || {}),
	};
};

export const apiOptionsGet = () => {
	return {
		method: "GET",
	};
};

export const apiGet = async (url: string) => {
	return api(url, apiOptionsGet());
};

export const apiPost = async (url: string, body?: any) => {
	return api(url, apiOptionsPost(body));
};

export const api = async (url: string, options?: RequestInit) => {
	const response = await fetch(url, options);

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	const { status, data, error } = await response.json();

	switch (status) {
		case "ok":
			return data;
		case "error":
			throw new Error(error || `Unknown error`);
		default:
			throw new Error(`Unknown status: ${status}`);
	}
};
