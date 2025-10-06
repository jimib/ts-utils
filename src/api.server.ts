export function stringifyJson<T>(json: T) {
	const data: string = JSON.stringify(json, null, "\t");
	//check that the data is valid
	JSON.parse(data);
	//return the sanity checked data
	return data;
}

export function parseJson<T>(json: string): T {
	//return the sanity checked data
	return JSON.parse(json) as T;
}

export const responseApiSuccess = (data: any, options?: { version?: number; cache?: string }) =>
	Response.json({
		version: options?.version ?? 1,
		cache: options?.cache,
		status: "ok",
		data,
	});

export const responseApiError = (error: string, options?: { version?: number; data?: any }) =>
	Response.json({
		version: options?.version ?? 1,
		status: "error",
		error,
		data: options?.data,
	});

export const versionedApi = (version: number) => {
	return {
		responseApiSuccess: (data: any, options?: { version?: number; cache?: string }) => responseApiSuccess(data, { version, ...options }),
		responseApiError: (error: string, options?: { version?: number }) => responseApiError(error, { version, ...options }),
	};
};

export async function parseApiResponse(response: Response) {
	if (!response.ok) {
		throw new Error("unknown error");
	}

	return response.json().then(({ status, data, error }) => {
		switch (status) {
			case "ok":
				return data;
			case "error":
				throw new Error(error ?? "unknown error");
			default:
				throw new Error("unknown status");
		}
	});
}
