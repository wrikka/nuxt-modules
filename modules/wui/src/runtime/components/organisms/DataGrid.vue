<script setup lang="ts">
import { ref } from 'vue'

interface Cell {
  key: string
  value: unknown
  editable?: boolean
  type?: 'text' | 'number' | 'select' | 'date'
  options?: Array<{ label: string; value: unknown }>
}

interface Row {
  id: string | number
  [key: string]: unknown
}

interface Column {
  key: string
  title: string
  width?: number
  editable?: boolean
  type?: 'text' | 'number' | 'select' | 'date'
  options?: Array<{ label: string; value: unknown }>
}

interface Props {
  columns: Column[]
  data: Row[]
  loading?: boolean
  striped?: boolean
  bordered?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  striped: false,
  bordered: true,
  size: 'md'
})

const emit = defineEmits<{
  'cellChange': [rowId: string | number, key: string, value: unknown]
  'rowChange': [row: Row]
}>()

const editingCell = ref<{ rowId: string | number; key: string } | null>(null)
const editValue = ref('')

const startEdit = (row: Row, column: Column) => {
  if (!column.editable) return
  editingCell.value = { rowId: row.id, key: column.key }
  editValue.value = String(row[column.key] ?? '')
}

const finishEdit = (row: Row, column: Column) => {
  if (!editingCell.value) return
  
  const newValue = column.type === 'number' ? Number(editValue.value) : editValue.value
  emit('cellChange', row.id, column.key, newValue)
  emit('rowChange', { ...row, [column.key]: newValue })
  editingCell.value = null
}

const sizeClasses = {
  sm: 'py-1 px-2 text-xs',
  md: 'py-2 px-3 text-sm',
  lg: 'py-3 px-4 text-base'
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="w-full">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            class="text-left font-medium text-gray-700"
            :class="sizeClasses[size]"
            :style="col.width ? { width: `${col.width}px` } : {}"
          >
            {{ col.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="row.id"
          class="border-t border-gray-200"
          :class="[
            striped && index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
            bordered ? 'border-b border-gray-200' : ''
          ]"
        >
          <td
            v-for="col in columns"
            :key="col.key"
            class="text-gray-900"
            :class="[sizeClasses[size], col.editable ? 'cursor-pointer hover:bg-blue-50' : '']"
            @click="startEdit(row, col)"
          >
            <template v-if="editingCell?.rowId === row.id && editingCell?.key === col.key">
              <Input
                v-if="col.type === 'text' || col.type === 'number' || !col.type"
                v-model="editValue"
                :type="col.type || 'text'"
                size="sm"
                @blur="finishEdit(row, col)"
                @keydown.enter="finishEdit(row, col)"
              />
              <Select
                v-else-if="col.type === 'select'"
                v-model="editValue"
                :options="col.options || []"
                size="sm"
                @change="finishEdit(row, col)"
              />
            </template>
            <template v-else>
              <slot :name="`cell-${col.key}`" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="flex items-center justify-center py-8">
      <Spinner />
    </div>
    <EmptyState
      v-if="!loading && data.length === 0"
      icon="table"
      title="No data"
      description="No records to display"
    />
  </div>
</template>
