<script setup lang="ts">
import { computed } from 'vue'

interface Column {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
}

interface Props {
  columns: Column[]
  sortKey?: string | null
  sortOrder?: 'asc' | 'desc'
  class?: string
}

const _props = defineProps<Props>()

const emit = defineEmits<{
  sort: [column: Column]
}>()

const _alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}
</script>

<template>
  <thead :class="['border-b bg-muted/50 font-medium [&>tr]:last:border-b-0', _props.class]">
    <tr class="border-b transition-colors hover:bg-muted/50">
      <th
        v-for="column in columns"
        :key="column.key"
        :class="[
          'h-12 px-4 text-left align-middle font-medium text-muted-foreground',
          column.sortable && 'cursor-pointer hover:text-foreground',
          _alignClasses[column.align || 'left']
        ]"
        @click="column.sortable && $emit('sort', column)"
      >
        <div class="flex items-center gap-1">
          {{ column.label }}
          <span
            v-if="column.sortable"
            :class="[
              'h-4 w-4 transition-transform',
              sortKey === column.key 
                ? sortOrder === 'asc' 
                  ? 'i-lucide-arrow-up' 
                  : 'i-lucide-arrow-down'
                : 'i-lucide-arrow-up-down opacity-30'
            ]"
          />
        </div>
      </th>
    </tr>
  </thead>
</template>
