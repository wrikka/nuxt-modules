<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { nextTick, onMounted, ref } from "vue";
import { useSpreadsheet } from "~/composables/useSpreadsheet";

const spreadsheet = useSpreadsheet();

const _editCell = async (rowIndex: number, colIndex: number) => {
	spreadsheet.editCell(rowIndex, colIndex);
	await nextTick();
	const input = document.querySelector(
		`[data-row='${rowIndex}'][data-col='${colIndex}'] input`,
	);
	(input as HTMLElement)?.focus();
};

const gridContainer = ref<HTMLElement | null>(null);

onMounted(() => {
	if (gridContainer.value) {
		spreadsheet.setViewportHeight(gridContainer.value.clientHeight);
		useEventListener(gridContainer.value, "scroll", () => {
			if (gridContainer.value) {
				spreadsheet.setScrollTop(gridContainer.value.scrollTop);
			}
		});
	}
});
</script>

<template>
  <div class="flex flex-col h-screen w-full overflow-hidden">
    <Toolbar :selected-style="spreadsheet.selectedCellStyle" @toggle-style="spreadsheet.toggleCellStyle" />
    <FormulaBar :cell-address="spreadsheet.selectedCellAddress" :cell-value="spreadsheet.selectedCellValue" @update:cellValue="spreadsheet.updateSelectedCellValue" />
    <div ref="gridContainer" class="flex-grow overflow-auto" @click="spreadsheet.handleClickOutside">
      <SpreadsheetGrid
        :grid="spreadsheet.grid"
        :get-column-name="spreadsheet.getColumnName"
        :is-selected="spreadsheet.isSelected"
        :is-editing="spreadsheet.isEditing"
        :update-cell-value="spreadsheet.updateCellValue"
        :start-row="spreadsheet.startRow"
        :end-row="spreadsheet.endRow"
        :cell-height="spreadsheet.cellHeight"
        @select-cell="spreadsheet.selectCell"
        @edit-cell="_editCell"
        @finish-editing="spreadsheet.finishEditing"
      />
    </div>
    <SheetTabs 
      :sheets="spreadsheet.sheets"
      :active-sheet-index="spreadsheet.activeSheetIndex"
      @add-sheet="spreadsheet.addSheet"
      @set-active-sheet="spreadsheet.setActiveSheet"
    />
  </div>
</template>
