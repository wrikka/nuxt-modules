/**
 * Calculate treemap value
 */
export function calculateTreeMapValue(node: any): number {
	if (node.value !== undefined) {
		return node.value;
	}

	if (node.children && node.children.length > 0) {
		return node.children.reduce(
			(sum: number, child: any) => sum + calculateTreeMapValue(child),
			0,
		);
	}

	return 1;
}
