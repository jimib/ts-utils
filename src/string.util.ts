export function pluralize(value: number, singular = "item", plural = singular + "s") {
	if (value === 1) {
		return singular;
	}

	return plural;
}
