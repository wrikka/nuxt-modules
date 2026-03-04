export function isDiffValue(
	value: unknown,
): value is { __old: unknown; __new: unknown } {
	return (
		typeof value === "object" &&
		value !== null &&
		"__old" in value &&
		"__new" in value
	);
}

export function isLcsDiff(value: unknown): value is { _lcs: unknown } {
	return typeof value === "object" && value !== null && "_lcs" in value;
}













