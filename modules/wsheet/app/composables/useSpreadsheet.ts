import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import type { CellStyle } from "~/stores/sheet";
import { ROWS, useSheetStore } from "~/stores/sheet";
import type { Coords } from "~/types/coordinates";

export function useSpreadsheet() {
	const sheetStore = useSheetStore();
	const { sheets, activeSheetIndex, grid } = storeToRefs(sheetStore);
	const { toggleCellStyle: storeToggleCellStyle, recalculateSheet } =
		sheetStore;

	const selectedCell = ref<Coords | null>(null);
	const editingCell = ref<Coords | null>(null);

	// State for virtualization
	const viewportHeight = ref(0);
	const scrollTop = ref(0);
	const cellHeight = 24; // Assuming fixed height for simplicity

	const visibleRowCount = computed(() =>
		Math.ceil(viewportHeight.value / cellHeight),
	);
	const startRow = computed(() => Math.floor(scrollTop.value / cellHeight));
	const endRow = computed(() =>
		Math.min(startRow.value + visibleRowCount.value + 5, ROWS),
	); // Add a buffer

	const setViewportHeight = (height: number) => {
		viewportHeight.value = height;
	};

	const setScrollTop = (top: number) => {
		scrollTop.value = top;
	};

	const getColumnName = (colIndex: number) =>
		String.fromCharCode(65 + colIndex);

	const isSelected = (rowIndex: number, colIndex: number) => {
		return (
			selectedCell.value?.row === rowIndex &&
			selectedCell.value?.col === colIndex
		);
	};

	const isEditing = (rowIndex: number, colIndex: number) => {
		return (
			editingCell.value?.row === rowIndex && editingCell.value?.col === colIndex
		);
	};

	const selectCell = (rowIndex: number, colIndex: number) => {
		if (!isEditing(rowIndex, colIndex)) {
			selectedCell.value = { col: colIndex, row: rowIndex };
			editingCell.value = null;
		}
	};

	const editCell = (rowIndex: number, colIndex: number) => {
		selectedCell.value = { col: colIndex, row: rowIndex };
		editingCell.value = { col: colIndex, row: rowIndex };
	};

	const finishEditing = () => {
		if (editingCell.value) {
			editingCell.value = null;
			recalculateSheet();
		}
	};

	const handleClickOutside = () => {
		selectedCell.value = null;
		finishEditing();
	};

	const selectedCellAddress = computed(() => {
		if (selectedCell.value) {
			return `${getColumnName(selectedCell.value.col)}${selectedCell.value.row + 1}`;
		}
		return "";
	});

	const selectedCellValue = computed(() => {
		if (selectedCell.value) {
			return (
				grid.value[selectedCell.value.row]?.[selectedCell.value.col]?.value ??
				""
			);
		}
		return "";
	});

	const selectedCellStyle = computed(() => {
		if (selectedCell.value) {
			return (
				grid.value[selectedCell.value.row]?.[selectedCell.value.col]?.style ??
				{}
			);
		}
		return {};
	});

	const updateSelectedCellValue = (newValue: string) => {
		if (selectedCell.value) {
			const cell = grid.value[selectedCell.value.row]?.[selectedCell.value.col];
			if (cell) {
				cell.value = newValue;
			}
		}
	};

	const toggleCellStyle = (style: keyof CellStyle) => {
		if (selectedCell.value) {
			storeToggleCellStyle({
				colIndex: selectedCell.value.col,
				rowIndex: selectedCell.value.row,
				style,
			});
		}
	};

	return {
		activeSheetIndex,
		addSheet: () => sheetStore.addSheet(),
		cellHeight,
		editCell,
		editingCell,
		endRow,
		finishEditing,
		getColumnName,
		grid,
		handleClickOutside,
		isEditing,
		isSelected,
		selectCell,
		selectedCell,
		selectedCellAddress,
		selectedCellStyle,
		selectedCellValue,
		setActiveSheet: (index: number) => sheetStore.setActiveSheet(index),
		setScrollTop,
		// Virtualization
		setViewportHeight,
		sheets,
		startRow,
		toggleCellStyle,
		updateCellValue: (rowIndex: number, colIndex: number, value: string) =>
			sheetStore.updateCellValue({ colIndex, rowIndex, value }),
		updateSelectedCellValue,
	};
}
