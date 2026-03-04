<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: Date | string | number
  format?: 'relative' | 'absolute' | 'time' | 'date' | 'datetime'
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  format: 'relative',
  locale: 'th-TH'
})

const formattedTime = computed(() => {
  const date = new Date(props.value)
  
  switch (props.format) {
    case 'relative':
      return useTimeAgo(date).value
    case 'time':
      return date.toLocaleTimeString(props.locale, { hour: '2-digit', minute: '2-digit' })
    case 'date':
      return date.toLocaleDateString(props.locale, { day: 'numeric', month: 'short', year: 'numeric' })
    case 'datetime':
      return date.toLocaleString(props.locale, { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      })
    default:
      return date.toLocaleString(props.locale)
  }
})
</script>

<template>
  <time :datetime="new Date(value).toISOString()" class="text-sm text-gray-600">
    {{ formattedTime }}
  </time>
</template>
