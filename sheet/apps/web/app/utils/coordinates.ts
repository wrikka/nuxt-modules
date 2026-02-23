import type { Coords } from "~/types/coordinates";

export function parseCoords(coordStr: string): Coords | null {
	const match = coordStr.match(/^([A-Z]+)(\d+)$/i);
	if (!match) return null;

	const colStr = match[1]?.toUpperCase() ?? "";
	const row = parseInt(match[2] ?? "0", 10) - 1;

	let col = 0;
	for (let i = 0; i < colStr.length; i++) {
		col = col * 26 + (colStr.charCodeAt(i) - 64);
	}
	col -= 1;

	return { col, row };
}
