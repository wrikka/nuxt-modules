<script setup lang="ts">
import { computed, provide } from 'vue'

interface Column {
  key: string
  label: string
  width?: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: Column[]
  data: Record<string, unknown>[]
  loading?: boolean
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  compact?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  loading: false,
  striped: false,
  bordered: true,
  hoverable: true,
  compact: false
})

const emit = defineEmits<{
  'rowClick': [row: Record<string, unknown>, index: number]
  'sort': [key: string, order: 'asc' | 'desc']
}>()

const _sortKey = ref<string | null>(null)
const _sortOrder = ref<'asc' | 'desc'>('asc')

const _handleSort = (column: Column) => {
  if (!column.sortable) return
  
  if (_sortKey.value === column.key) {
    _sortOrder.value = _sortOrder.value === 'asc' ? 'desc' : 'asc'
  }
  else {
    _sortKey.value = column.key
    _sortOrder.value = 'asc'
  }
  
  emit('sort', _sortKey.value, _sortOrder.value)
}

const _containerClasses = computed(() => [
  'w-full overflow-auto rounded-md border',
  _props.bordered ? 'border-border' : 'border-transparent'
])

provide('table', {
  columns: _props.columns,
  striped: _props.striped,
  hoverable: _props.hoverable,
  compact: _props.compact
})

import { ref } from 'vue'
</script>

<template>
  <div :class="_containerClasses">
    <table class="w-full caption-bottom text-sm">
      <WTableHeader
        :columns="columns"
        :sort-key="_sortKey"
        :sort-order="_sortOrder"
        @sort="_handleSort"
      />
      <tbody class="[&_tr:last-child]:border-0">
        <WTableRow
          v-for="(row, index) in data"
          :key="index"
          :row="row"
          :index="index"
          :striped="striped"
          :hoverable="hoverable"
          @click="$emit('rowClick', row, index)"
        >
          <WTableCell
            v-for="column in columns"
            :key="column.key"
            :align="column.align"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
              {{ row[column.key] }}
            </slot>
          </WTableCell>
        </WTableRow>
        
        <tr v-if="data.length === 0 && !loading">
          <td :colspan="columns.length" class="p-8 text-center text-muted-foreground">
            <WEmpty description="No data available" />
          </td>
        </tr>
        
        <tr v-if="loading">
          <td :colspan="columns.length" class="p-8">
            <WSkeleton :rows="3" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
