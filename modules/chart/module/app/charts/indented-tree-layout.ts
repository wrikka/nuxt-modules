import { getSeriesColor } from '@/module/app/utils/chart-utils';

/**
 * Generate tree lines recursively
 */
export function generateTreeLines(
	node: any,
	x: number,
	y: number,
	lineHeight: number,
	indentWidth: number,
	fontSize: number,
	colorBy: string,
	showExpanders: boolean,
	initialExpandLevel: number,
	level: number = 0,
	parent?: string,
): Array<{
	id: string;
	text: string;
	level: number;
	x: number;
	y: number;
	width: number;
	height: number;
	parent?: string;
	children: string[];
	expanded: boolean;
	visible: boolean;
	color?: string;
}> {
	const lines: Array<{
		id: string;
		text: string;
		level: number;
		x: number;
		y: number;
		width: number;
		height: number;
		parent?: string;
		children: string[];
		expanded: boolean;
		visible: boolean;
		color?: string;
	}> = [];

	const hasChildren = node.children && node.children.length > 0;
	const expanded = level <= initialExpandLevel || initialExpandLevel < 0;
	const visible = expanded;

	// Create indentation string
	const indent = "  ".repeat(level);
	const expander = showExpanders && hasChildren ? (expanded ? "▼ " : "▶ ") : "";
	const text = `${indent}${expander}${node.name}`;

	// Assign color
	let color: string;
	switch (colorBy) {
		case "level":
			color = getSeriesColor(level);
			break;
		case "branch":
			color = parent
				? getSeriesColor(
						Math.abs(
							parent.split("").reduce((a, b) => a + b.charCodeAt(0), 0),
						) % 10,
					)
				: getSeriesColor(0);
			break;
		default:
			color = "#000000";
	}

	const line = {
		id: node.id,
		text,
		level,
		x,
		y,
		width: text.length * fontSize * 0.6, // Approximate width
		height: lineHeight,
		parent,
		children: node.children ? node.children.map((child: any) => child.id) : [],
		expanded,
		visible,
		color,
	};

	lines.push(line);

	// Add children if expanded
	if (hasChildren && expanded) {
		let currentY = y + lineHeight;

		node.children.forEach((child: any) => {
			const childLines = generateTreeLines(
				child,
				x,
				currentY,
				lineHeight,
				indentWidth,
				fontSize,
				colorBy,
				showExpanders,
				initialExpandLevel,
				level + 1,
				node.id,
			);

			lines.push(...childLines);
			currentY += childLines.length * lineHeight;
		});
	}

	return lines;
}


