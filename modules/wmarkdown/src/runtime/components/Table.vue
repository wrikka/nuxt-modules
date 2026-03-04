<script setup lang="ts">
interface TableData {
  headers: string[]
  rows: string[][]
  alignments?: (string | null)[]
}

interface Props {
  data: TableData
  sortable?: boolean
  filterable?: boolean
  striped?: boolean
  bordered?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  sortable: true,
  filterable: true,
  striped: true,
  bordered: true,
  hover: true
})

const emit = defineEmits<{
  sort: [column: number, direction: 'asc' | 'desc']
  filter: [column: number, value: string]
}>()

const sortColumn = ref<number | null>(null)
const sortDirection = ref<'asc' | 'desc'>('asc')
const filters = ref<Record<number, string>>({})

const sortedRows = computed(() => {
  let rows = [...props.data.rows]

  Object.entries(filters.value).forEach(([col, value]) => {
    if (value) {
      const colIndex = parseInt(col)
      rows = rows.filter(row =>
        row[colIndex]?.toLowerCase().includes(value.toLowerCase())
      )
    }
  })

  if (sortColumn.value !== null) {
    rows.sort((a, b) => {
      const aVal = a[sortColumn.value!] || ''
      const bVal = b[sortColumn.value!] || ''
      const comparison = aVal.localeCompare(bVal)
      return sortDirection.value === 'asc' ? comparison : -comparison
    })
  }

  return rows
})

const toggleSort = (column: number) => {
  if (sortColumn.value === column) {
    if (sortDirection.value === 'asc') {
      sortDirection.value = 'desc'
    } else {
      sortColumn.value = null
    }
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
  emit('sort', column, sortDirection.value)
}

const updateFilter = (column: number, value: string) => {
  filters.value[column] = value
  emit('filter', column, value)
}

const clearFilters = () => {
  filters.value = {}
}
</script>

<template>
  <div class="wmarkdown-table-wrapper">
    <div
      v-if="filterable && Object.keys(filters).length > 0"
      class="table-actions"
    >
      <button
        class="clear-filters-btn"
        @click="clearFilters"
      >
        <Icon name="lucide:x" />
        Clear filters
      </button>
    </div>

    <div class="table-container">
      <table
        class="wmarkdown-table"
        :class="{
          'table-striped': striped,
          'table-bordered': bordered,
          'table-hover': hover
        }"
      >
        <thead>
          <tr>
            <th
              v-for="(header, index) in data.headers"
              :key="index"
              class="table-header"
              :style="data.alignments?.[index] ? { textAlign: data.alignments[index] as string } : {}"
              :class="{ sortable: sortable, 'sort-active': sortColumn === index }"
              @click="sortable && toggleSort(index)"
            >
              <div class="header-content">
                <span>{{ header }}</span>
                <span
                  v-if="sortable"
                  class="sort-icon"
                >
                  <Icon
                    v-if="sortColumn === index"
                    :name="sortDirection === 'asc' ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                  />
                  <Icon
                    v-else
                    name="lucide:chevrons-up-down"
                    class="sort-inactive"
                  />
                </span>
              </div>

              <div
                v-if="filterable"
                class="filter-input"
              >
                <input
                  type="text"
                  :placeholder="`Filter ${header}...`"
                  :value="filters[index]"
                  @click.stop
                  @input="(e) => updateFilter(index, (e.target as HTMLInputElement).value)"
                >
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in sortedRows"
            :key="rowIndex"
          >
            <td
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :style="data.alignments?.[cellIndex] ? { textAlign: data.alignments[cellIndex] as string } : {}"
            >
              <slot
                :name="`cell-${cellIndex}`"
                :cell="cell"
                :row="row"
                :row-index="rowIndex"
                :cell-index="cellIndex"
              >
                {{ cell }}
              </slot>
            </td>
          </tr>
          <tr v-if="sortedRows.length === 0">
            <td
              :colspan="data.headers.length"
              class="no-data"
            >
              <div class="no-data-content">
                <Icon name="lucide:inbox" />
                <span>No matching data found</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer">
      <span class="table-info">
        Showing {{ sortedRows.length }} of {{ data.rows.length }} rows
      </span>
    </div>
  </div>
</template>

<style scoped>
.wmarkdown-table-wrapper {
  @apply rounded-xl overflow-hidden;
  background: var(--wmd-bg-primary);
  border: 1px solid var(--wmd-border-light);
  box-shadow: var(--wmd-shadow-sm);
  transition: box-shadow var(--wmd-transition-base);
}

.wmarkdown-table-wrapper:hover {
  box-shadow: var(--wmd-shadow-md);
}

.table-actions {
  @apply px-5 py-3 flex items-center justify-between;
  background: var(--wmd-bg-secondary);
  border-bottom: 1px solid var(--wmd-border-light);
}

.clear-filters-btn {
  @apply flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium;
  @apply transition-all duration-200;
  background: var(--wmd-bg-primary);
  color: var(--wmd-text-secondary);
  border: 1px solid var(--wmd-border-light);
}

.clear-filters-btn:hover {
  background: var(--wmd-danger-50);
  color: var(--wmd-danger-600);
  border-color: var(--wmd-danger-200);
}

.table-container {
  @apply overflow-x-auto;
}

.wmarkdown-table {
  @apply w-full text-sm;
  border-collapse: separate;
  border-spacing: 0;
}

.wmarkdown-table thead {
  @apply sticky top-0 z-10;
  background: var(--wmd-bg-secondary);
}

.table-header {
  @apply px-5 py-4 text-left font-semibold;
  @apply transition-all duration-200;
  color: var(--wmd-text-primary);
  border-bottom: 1px solid var(--wmd-border-light);
  font-size: var(--wmd-text-xs);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table-header.sortable {
  @apply cursor-pointer;
}

.table-header.sortable:hover {
  background: var(--wmd-bg-tertiary);
  color: var(--wmd-primary-600);
}

.table-header.sort-active {
  background: var(--wmd-primary-50);
  color: var(--wmd-primary-700);
}

.header-content {
  @apply flex items-center gap-2;
}

.sort-icon {
  @apply w-4 h-4;
  color: var(--wmd-text-muted);
  transition: all var(--wmd-transition-fast);
}

.table-header.sort-active .sort-icon {
  color: var(--wmd-primary-500);
}

.sort-icon .sort-inactive {
  @apply opacity-0;
  transition: opacity var(--wmd-transition-fast);
}

.table-header:hover .sort-inactive {
  @apply opacity-50;
}

.filter-input {
  @apply mt-2;
}

.filter-input input {
  @apply w-full px-3 py-2 text-sm rounded-lg;
  @apply transition-all duration-200;
  background: var(--wmd-bg-primary);
  border: 1px solid var(--wmd-border-default);
  color: var(--wmd-text-primary);
}

.filter-input input:focus {
  @apply outline-none;
  border-color: var(--wmd-primary-400);
  box-shadow: 0 0 0 3px var(--wmd-primary-100);
}

.filter-input input::placeholder {
  color: var(--wmd-text-muted);
}

.wmarkdown-table tbody tr {
  @apply transition-all duration-150;
  border-bottom: 1px solid var(--wmd-border-light);
}

.wmarkdown-table tbody tr:last-child {
  border-bottom: none;
}

.wmarkdown-table.table-striped tbody tr:nth-child(even) {
  background: var(--wmd-bg-secondary);
}

.wmarkdown-table.table-bordered td,
.wmarkdown-table.table-bordered th {
  border: 1px solid var(--wmd-border-light);
}

.wmarkdown-table.table-hover tbody tr:hover {
  background: var(--wmd-primary-50);
  transform: scale(1.002);
  box-shadow: var(--wmd-shadow-sm);
}

.wmarkdown-table td {
  @apply px-5 py-4;
  color: var(--wmd-text-secondary);
  transition: all var(--wmd-transition-fast);
}

.no-data {
  @apply py-12 text-center;
  background: var(--wmd-bg-secondary);
}

.no-data-content {
  @apply flex flex-col items-center gap-3;
  color: var(--wmd-text-muted);
}

.no-data-content svg {
  @apply w-12 h-12 opacity-50;
}

.table-footer {
  @apply px-5 py-3 flex items-center justify-between;
  background: var(--wmd-bg-secondary);
  border-top: 1px solid var(--wmd-border-light);
}

.table-info {
  @apply text-sm font-medium;
  color: var(--wmd-text-secondary);
}

/* Dark mode adjustments */
[data-theme="dark"] .wmarkdown-table-wrapper {
  background: var(--wmd-bg-primary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .table-actions,
[data-theme="dark"] .table-footer {
  background: var(--wmd-bg-tertiary);
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .wmarkdown-table thead {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .table-header {
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .table-header.sortable:hover {
  background: var(--wmd-bg-secondary);
}

[data-theme="dark"] .table-header.sort-active {
  background: rgba(59, 130, 246, 0.15);
}

[data-theme="dark"] .wmarkdown-table tbody tr {
  border-color: var(--wmd-border-default);
}

[data-theme="dark"] .wmarkdown-table.table-striped tbody tr:nth-child(even) {
  background: var(--wmd-bg-tertiary);
}

[data-theme="dark"] .wmarkdown-table.table-hover tbody tr:hover {
  background: rgba(59, 130, 246, 0.1);
}

[data-theme="dark"] .no-data {
  background: var(--wmd-bg-tertiary);
}
</style>
