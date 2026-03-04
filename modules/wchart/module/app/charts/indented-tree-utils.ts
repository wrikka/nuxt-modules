/**
 * Calculate indented tree bounds
 */
export function calculateIndentedTreeBounds(
	lines: Array<{ x: number; y: number; width: number; height: number }>,
): { x: number; y: number; width: number; height: number } {
	if (lines.length === 0) {
		return { x: 0, y: 0, width: 0, height: 0 };
	}

	const minX = Math.min(...lines.map((l) => l.x));
	const maxX = Math.max(...lines.map((l) => l.x + l.width));
	const minY = Math.min(...lines.map((l) => l.y));
	const maxY = Math.max(...lines.map((l) => l.y + l.height));

	return {
		x: minX,
		y: minY,
		width: maxX - minX,
		height: maxY - minY,
	};
}

/**
 * Reposition indented tree lines after visibility changes
 */
export function repositionIndentedTreeLines(
	lines: Array<{
		id: string;
		text: string;
		level: number;
		x: number;
		y: number;
		width: number;
		height: number;
		visible: boolean;
	}>,
	lineHeight: number,
): Array<{
	id: string;
	text: string;
	level: number;
	x: number;
	y: number;
	width: number;
	height: number;
	visible: boolean;
}> {
	let currentY = lines[0].y;

	return lines.map((line) => {
		if (line.visible) {
			const updatedLine = { ...line, y: currentY };
			currentY += lineHeight;
			return updatedLine;
		}
		return line;
	});
}


