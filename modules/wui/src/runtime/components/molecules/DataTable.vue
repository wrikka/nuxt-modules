<script setup lang="ts">
import { ref, computed } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

interface Props {
  data: Record<string, any>[]
  columns: Column[]
  loading?: boolean
  sortable?: boolean
  selectable?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  sortable: true,
  selectable: false
})

const emit = defineEmits<{
  'row-click': [row: Record<string, any>, index: number]
  'selection-change': [selectedRows: Record<string, any>[]]
  'sort': [config: SortConfig]
}>()

const selectedRows = ref<Record<string, any>[]>([])
const sortConfig = ref<SortConfig | null>(null)

const _sortedData = computed(() => {
  if (!sortConfig.value) return props.data
  
  return [...props.data].sort((a, b) => {
    const aValue = a[sortConfig.value?.key]
    const bValue = b[sortConfig.value?.key]
    
    if (aValue < bValue) return sortConfig.value?.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.value?.direction === 'asc' ? 1 : -1
    return 0
  })
})

const isAllSelected = computed(() => {
  return props.data.length > 0 && selectedRows.value.length === props.data.length
})

const _isRowSelected = (row: Record<string, any>) => {
  return selectedRows.value.some(selected => selected === row)
}

const _onRowClick = (row: Record<string, any>, index: number) => {
  emit('row-click', row, index)
}

const _onSort = (column: Column) => {
  if (!props.sortable || !column.sortable) return
  
  const direction = sortConfig.value?.key === column.key && sortConfig.value.direction === 'asc' ? 'desc' : 'asc'
  sortConfig.value = { key: column.key, direction }
  emit('sort', sortConfig.value)
}

const _toggleAllSelection = () => {
  if (isAllSelected.value) {
    selectedRows.value = []
  } else {
    selectedRows.value = [...props.data]
  }
  emit('selection-change', selectedRows.value)
}

const _toggleRowSelection = (row: Record<string, any>) => {
  const index = selectedRows.value.indexOf(row)
  if (index > -1) {
    selectedRows.value.splice(index, 1)
  } else {
    selectedRows.value.push(row)
  }
  emit('selection-change', selectedRows.value)
}

const _getAlignClass = (align?: string) => {
  const aligns = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }
  return align ? aligns[align as keyof typeof aligns] : 'text-left'
}
</script>

<template>
  <div :class="['w-full overflow-auto', props.class]">
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-b bg-muted/50">
          <!-- Checkbox column -->
          <th v-if="selectable" class="w-12 p-4">
            <input
              type="checkbox"
              :checked="isAllSelected"
              class="rounded border-primary"
              @change="toggleAllSelection"
            />
          </th>
          
          <!-- Data columns -->
          <th
            v-for="column in columns"
            :key="column.key"
            :class="[
              'p-4 font-medium text-muted-foreground',
              getAlignClass(column.align),
              sortable && column.sortable && 'cursor-pointer hover:text-foreground'
            ]"
            :style="{ width: column.width }"
            @click="onSort(column)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <div
                v-if="sortable && column.sortable && sortConfig?.key === column.key"
                class="i-lucide-chevron-up h-4 w-4"
                :class="{ 'rotate-180': sortConfig.direction === 'desc' }"
              />
            </div>
          </th>
        </tr>
      </thead>
      
      <tbody>
        <tr v-if="loading">
          <td :colspan="columns.length + (selectable ? 1 : 0)" class="p-8 text-center">
            <div class="flex items-center justify-center space-x-2">
              <div class="i-lucide-loader-2 h-4 w-4 animate-spin" />
              <span>Loading...</span>
            </div>
          </td>
        </tr>
        
        <tr
          v-else
          v-for="(row, index) in sortedData"
          :key="index"
          class="border-b hover:bg-muted/50 transition-colors"
          @click="onRowClick(row, index)"
        >
          <!-- Checkbox column -->
          <td v-if="selectable" class="p-4">
            <input
              type="checkbox"
              :checked="isRowSelected(row)"
              class="rounded border-primary"
              @change="toggleRowSelection(row)"
            />
          </td>
          
          <!-- Data columns -->
          <td
            v-for="column in columns"
            :key="column.key"
            :class="['p-4', getAlignClass(column.align)]"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
        
        <tr v-if="!loading && sortedData.length === 0">
          <td :colspan="columns.length + (selectable ? 1 : 0)" class="p-8 text-center text-muted-foreground">
            No data available
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
