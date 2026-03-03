import { Parser } from "hot-formula-parser";
import type { MaybeRef } from "vue";
import { unref } from "vue";
import { parseCoords } from "~/utils/coordinates";

export function useFormulaParser(grid: MaybeRef<string[][]>) {
	const parser = new Parser();
	const unrefGrid = unref(grid);
	const ROWS = unrefGrid.length;
	const COLS = unrefGrid[0]?.length ?? 0;

	parser.on(
		"callCellValue",
		(
			cellCoord: { label: string },
			done: (value: string | number | boolean) => void,
		) => {
			const coords = parseCoords(cellCoord.label);
			if (coords && coords.row < ROWS && coords.col < COLS) {
				const row = unrefGrid[coords.row];
				if (row) {
					const cell = unrefGrid[coords.row]?.[coords.col];
					if (cell === undefined) return done(""); // Should not happen with valid coords
					const rawValue = cell;
					const value = parseFloat(rawValue);
					done(Number.isNaN(value) ? rawValue : value);
					return;
				}
			}
			done("");
		},
	);

	parser.on(
		"callRangeValue",
		(
			startCellCoord: { label: string },
			endCellCoord: { label: string },
			done: (value: (string | number | boolean)[][]) => void,
		) => {
			const start = parseCoords(startCellCoord.label);
			const end = parseCoords(endCellCoord.label);

			if (start && end) {
				const range: (string | number | boolean)[][] = [];
				for (let rowIdx = start.row; rowIdx <= end.row; rowIdx++) {
					const rowData: (string | number | boolean)[] = [];
					const row = unrefGrid[rowIdx];
					if (row) {
						for (let colIdx = start.col; colIdx <= end.col; colIdx++) {
							const rawValue = row[colIdx];
							if (rawValue !== undefined) {
								const value = parseFloat(rawValue);
								rowData.push(Number.isNaN(value) ? rawValue : value);
							}
						}
					}
					range.push(rowData);
				}
				done(range);
			} else {
				done([]);
			}
		},
	);

	return {
		parser,
	};
}
