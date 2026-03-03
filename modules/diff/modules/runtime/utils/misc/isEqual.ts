export function isEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true;
	if (a == null || b == null) return a === b;
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return false;
		for (let i = 0; i < a.length; i++) {
			if (!isEqual(a[i], b[i])) return false;
		}
		return true;
	}
	if (typeof a === "object" && typeof b === "object") {
		const keysA = Object.keys(a);
		const keysB = Object.keys(b as object);
		if (keysA.length !== keysB.length) return false;
		for (const key of keysA) {
			if (!(key in (b as object))) return false;
			if (!isEqual((a as any)[key], (b as any)[key])) return false;
		}
		return true;
	}
	return false;
}

export function isObjectLike(
	value: unknown,
): value is Record<string, unknown> | unknown[] {
	return value !== null && typeof value === "object";
}













