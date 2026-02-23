import { Parser } from "hot-formula-parser";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";
import { parseCoords } from "~/utils/coordinates";

// Define interfaces for cell styling and data
export interface CellStyle {
	bold?: boolean;
	italic?: boolean;
	underline?: boolean;
	strikethrough?: boolean;
}

export interface CellData {
	value: string;
	displayValue: string;
	style: CellStyle;
}

export interface Sheet {
	name: string;
	grid: CellData[][];
}

export const COLS = 26;
export const ROWS = 100;

// Helper to create a new grid with CellData objects
const createGrid = (): CellData[][] =>
	Array.from({ length: ROWS }, () =>
		Array.from(
			{ length: COLS },
			(): CellData => ({ displayValue: "", style: {}, value: "" }),
		),
	);

export const useSheetStore = defineStore("sheet", () => {
	const sheets = reactive<Sheet[]>([
		{
			grid: createGrid(),
			name: "Sheet1",
		},
	]);
	const activeSheetIndex = ref(0);

	const activeSheet = computed(() => sheets[activeSheetIndex.value]);
	const grid = computed(() => activeSheet.value?.grid ?? []);

	function addSheet() {
		const newSheetName = `Sheet${sheets.length + 1}`;
		sheets.push({
			grid: createGrid(),
			name: newSheetName,
		});
		activeSheetIndex.value = sheets.length - 1;
	}

	function setActiveSheet(index: number) {
		if (index >= 0 && index < sheets.length) {
			activeSheetIndex.value = index;
		}
	}

	function updateCellValue(payload: {
		rowIndex: number;
		colIndex: number;
		value: string;
	}) {
		const { rowIndex, colIndex, value } = payload;
		const cell = grid.value[rowIndex]?.[colIndex];
		if (cell) {
			cell.value = value;
			if (!value.startsWith("=")) {
				cell.displayValue = value;
			}
		}
	}

	// Formula parsing logic
	const parser = new Parser();

	parser.on(
		"callCellValue",
		(cellCoord: { label: string }, done: (value: string | number) => void) => {
			const coords = parseCoords(cellCoord.label);
			if (coords && coords.row < ROWS && coords.col < COLS) {
				const cell = grid.value[coords.row]?.[coords.col];
				if (cell) {
					const rawValue = cell.value; // Use raw value for dependencies
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
			done: (value: (string | number)[][]) => void,
		) => {
			const start = parseCoords(startCellCoord.label);
			const end = parseCoords(endCellCoord.label);

			if (start && end) {
				const range: (string | number)[][] = [];
				for (let rowIdx = start.row; rowIdx <= end.row; rowIdx++) {
					const rowData: (string | number)[] = [];
					const row = grid.value[rowIdx];
					if (row) {
						for (let colIdx = start.col; colIdx <= end.col; colIdx++) {
							const cell = row[colIdx];
							if (cell) {
								const rawValue = cell.value; // Use raw value for dependencies
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

	function recalculateSheet() {
		const currentGrid = grid.value;
		for (let r = 0; r < ROWS; r++) {
			const row = currentGrid[r];
			if (row) {
				for (let c = 0; c < COLS; c++) {
					const cell = row[c];
					if (
						cell &&
						typeof cell.value === "string" &&
						cell.value.startsWith("=")
					) {
						const result = parser.parse(cell.value.substring(1));
						cell.displayValue = result.error
							? "#ERROR!"
							: String(result.result);
					} else if (cell) {
						cell.displayValue = cell.value;
					}
				}
			}
		}
	}

	function toggleCellStyle(payload: {
		rowIndex: number;
		colIndex: number;
		style: keyof CellStyle;
	}) {
		const { rowIndex, colIndex, style } = payload;
		const cell = grid.value[rowIndex]?.[colIndex];
		if (cell) {
			cell.style[style] = !cell.style[style];
		}
	}

	return {
		activeSheet,
		activeSheetIndex,
		addSheet,
		grid,
		recalculateSheet,
		setActiveSheet,
		sheets,
		toggleCellStyle,
		updateCellValue,
	};
});
