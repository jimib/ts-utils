export function mapSeries<T, R>(arr: T[], iterator: (a: T, i: number, arr: T[]) => Promise<R>): Promise<R[]> {
	return new Promise(async (resolve, reject) => {
		var results = [];

		for (var i = 0; i < arr.length; i++) {
			var item = arr[i];
			if (item) {
				results.push(await iterator(item, i, arr));
			}
		}

		resolve(results);
	});
}

export function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
