<script setup lang="ts">
import type { TableColumn, TableItem } from './types'

interface Props {
  columns: TableColumn[]
  items: TableItem[]
  childrenKey?: string
  striped?: boolean
  hover?: boolean
  dense?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  childrenKey: 'children',
  striped: false,
  hover: true,
  dense: false
})

const emit = defineEmits<{
  rowClick: [item: TableItem]
  toggleExpand: [item: TableItem]
}>()

const expandedRows = ref<Set<string | number>>(new Set())

const toggleExpand = (item: TableItem) => {
  const id = item.id as string | number
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
  emit('toggleExpand', item)
}

const isExpanded = (item: TableItem) => {
  return expandedRows.value.has(item.id as string | number)
}

const hasChildren = (item: TableItem) => {
  return item[props.childrenKey] && (item[props.childrenKey] as TableItem[]).length > 0
}

const getItemLevel = (item: TableItem): number => {
  return item._level || 0
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 overflow-hidden">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-4 py-3 font-medium text-gray-700"
            :class="{ 'w-px': column.key === 'expand' }"
          >
            {{ column.title }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in items" :key="item.id">
          <tr
            class="border-t border-gray-200"
            :class="[
              striped && index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
              hover ? 'hover:bg-gray-50' : '',
              dense ? '' : ''
            ]"
            @click="emit('rowClick', item)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-4 py-3"
              :style="column.key !== 'expand' ? { paddingLeft: `${16 + getItemLevel(item) * 24}px` } : {}"
            >
              <template v-if="column.key === 'expand'">
                <button
                  v-if="hasChildren(item)"
                  type="button"
                  class="rounded p-1 hover:bg-gray-100"
                  @click.stop="toggleExpand(item)"
                >
                  <span
                    class="i-lucide-chevron-right size-4 transition-transform"
                    :class="{ 'rotate-90': isExpanded(item) }"
                  />
                </button>
              </template>
              <slot v-else :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                {{ item[column.key] }}
              </slot>
            </td>
          </tr>
          
          <template v-if="isExpanded(item) && hasChildren(item)">
            <tr
              v-for="child in (item[childrenKey] as TableItem[])"
              :key="child.id"
              class="border-t border-gray-100"
              :class="[
                striped && index % 2 === 1 ? 'bg-gray-50/50' : 'bg-gray-50/30',
                hover ? 'hover:bg-gray-50' : ''
              ]"
              @click="emit('rowClick', child)"
            >
              <td
                v-for="column in columns"
                :key="`child-${column.key}`"
                class="px-4 py-2"
                :style="column.key !== 'expand' ? { paddingLeft: `${16 + (getItemLevel(child) + 1) * 24}px` } : {}"
              >
                <template v-if="column.key === 'expand'">
                  <span class="inline-block w-6" />
                </template>
                <slot v-else :name="`cell-${column.key}`" :item="child" :value="child[column.key]">
                  {{ child[column.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </template>
      </tbody>
    </table>
  </div>
</template>
