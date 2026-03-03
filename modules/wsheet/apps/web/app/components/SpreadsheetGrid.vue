<script setup lang="ts">
import { computed } from "vue";
import type { CellData } from "~/stores/sheet";

const props = defineProps<{
	grid: CellData[][];
	getColumnName: (colIndex: number) => string;
	isSelected: (rowIndex: number, colIndex: number) => boolean;
	isEditing: (rowIndex: number, colIndex: number) => boolean;
	updateCellValue: (rowIndex: number, colIndex: number, value: string) => void;
	startRow: number;
	endRow: number;
	cellHeight: number;
}>();

const _emit = defineEmits<{
	(e: "selectCell", rowIndex: number, colIndex: number): void;
	(e: "editCell", rowIndex: number, colIndex: number): void;
	(e: "finishEditing"): void;
}>();

const _handleInput = (event: Event, rowIndex: number, colIndex: number) => {
	const target = event.target as HTMLInputElement;
	props.updateCellValue(rowIndex, colIndex, target.value);
};

const _getCellClass = (rowIndex: number, colIndex: number) => {
	const cell = props.grid[rowIndex]?.[colIndex];
	return {
		"border-2 border-sky-500 p-0!": props.isSelected(rowIndex, colIndex),
		"font-bold": cell?.style.bold,
		italic: cell?.style.italic,
		"line-through": cell?.style.strikethrough,
		underline: cell?.style.underline,
	};
};

const _visibleRows = computed(() =>
	props.grid.slice(props.startRow, props.endRow).map((row, index) => ({
		data: row,
		originalIndex: props.startRow + index,
	})),
);

const _paddingTop = computed(() => props.startRow * props.cellHeight);
const _totalHeight = computed(() => props.grid.length * props.cellHeight);
</script>

<template>
  <div :style="{ height: `${_totalHeight}px` }" class="relative">
    <table class="border-collapse table-fixed absolute top-0 left-0" :style="{ transform: `translateY(${_paddingTop}px)` }">
      <thead>
        <tr>
          <th class="sticky left-0 min-w-50px z-3 bg-gray-50 font-medium text-center align-middle"></th>
          <th v-if="grid.length > 0 && grid[0]" v-for="(_, colIndex) in grid[0]" :key="colIndex" class="sticky top-0 bg-gray-50 font-medium text-center align-middle z-2">{{ getColumnName(colIndex) }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in _visibleRows" :key="row.originalIndex">
          <th class="sticky left-0 min-w-50px z-3 bg-gray-50 font-medium text-center align-middle">{{ row.originalIndex + 1 }}</th>
          <td 
            v-for="(cell, colIndex) in row.data" 
            :key="colIndex" 
            class="border border-gray-300 p-0 min-w-100px h-24px box-border relative text-left align-top"
            :class="_getCellClass(row.originalIndex, colIndex)"
            @click.stop="_emit('selectCell', row.originalIndex, colIndex)"
            @dblclick="_emit('editCell', row.originalIndex, colIndex)">
            <input 
              v-if="isEditing(row.originalIndex, colIndex) && grid[row.originalIndex]"
              type="text" 
              :value="grid[row.originalIndex]?.[colIndex]?.value"
              @input="event => _handleInput(event, row.originalIndex, colIndex)"
              class="w-full h-full border-none outline-none p-1 box-border"
              :class="_getCellClass(row.originalIndex, colIndex)"
              @blur="_emit('finishEditing')" 
              @keyup.enter="_emit('finishEditing')"
                          />
            <span v-else class="p-1 block w-full h-full box-border">{{ cell.displayValue }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
