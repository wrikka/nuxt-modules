<script setup lang="ts">
import { ref } from 'vue'

interface Filter {
  label: string
  value: string | number
  active?: boolean
}

interface Props {
  filters: Filter[]
  multiple?: boolean
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  multiple: false,
  size: 'md'
})

const emit = defineEmits<{
  'update:filters': [filters: Filter[]]
  change: [activeFilters: (string | number)[]]
}>()

const activeFilters = ref<(string | number)[]>(
  props.filters.filter(f => f.active).map(f => f.value)
)

const toggle = (value: string | number) => {
  if (props.multiple) {
    const index = activeFilters.value.indexOf(value)
    if (index > -1) {
      activeFilters.value.splice(index, 1)
    } else {
      activeFilters.value.push(value)
    }
  } else {
    activeFilters.value = activeFilters.value.includes(value) ? [] : [value]
  }
  
  emit('change', activeFilters.value)
  emit('update:filters', props.filters.map(f => ({
    ...f,
    active: activeFilters.value.includes(f.value)
  })))
}
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      v-for="filter in filters"
      :key="filter.value"
      type="button"
      class="rounded-full px-3 py-1 text-sm font-medium transition-colors"
      :class="[
        filter.active || activeFilters.includes(filter.value)
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : ''
      ]"
      @click="toggle(filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>
