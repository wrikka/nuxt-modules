export function getValueByPath(
	obj: unknown,
	path: string,
): unknown | undefined {
	const keys = path.split(".");
	let current: unknown = obj;

	for (const key of keys) {
		if (typeof current !== "object" || current === null) {
			return undefined;
		}

		if (Array.isArray(current)) {
			const index = Number.parseInt(key, 10);
			if (Number.isNaN(index)) {
				return undefined;
			}
			current = current[index];
		} else {
			current = (current as Record<string, unknown>)[key];
		}

		if (current === undefined) {
			return undefined;
		}
	}

	return current;
}

export function setValueByPath(
	obj: Record<string, unknown>,
	path: string,
	value: unknown,
): void {
	const keys = path.split(".");
	const lastKey = keys.pop()!;

	let current: Record<string, unknown> = obj;

	for (const key of keys) {
		if (!(key in current)) {
			current[key] = {};
		}

		const next = current[key];
		if (typeof next !== "object" || next === null) {
			current[key] = {};
		}

		current = current[key] as Record<string, unknown>;
	}

	current[lastKey] = value;
}













