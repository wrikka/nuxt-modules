import { describe, expect, it } from "vitest";
import { useSpreadsheet } from "./useSpreadsheet";

describe("useSpreadsheet", () => {
	it("should select a cell", () => {
		const { selectCell, selectedCell } = useSpreadsheet();
		selectCell(1, 2);
		expect(selectedCell.value).toEqual({ col: 2, row: 1 });
	});

	it("should update a cell value", () => {
		const { updateCellValue, grid } = useSpreadsheet();
		updateCellValue(0, 0, "test");
		expect(grid.value[0]?.[0]?.value).toBe("test");
	});

	it("should toggle cell style", () => {
		const { selectCell, toggleCellStyle, grid } = useSpreadsheet();
		selectCell(3, 3);
		toggleCellStyle("bold");
		expect(grid.value[3]?.[3]?.style.bold).toBe(true);
		toggleCellStyle("bold");
		expect(grid.value[3]?.[3]?.style.bold).toBe(false);
	});
});
