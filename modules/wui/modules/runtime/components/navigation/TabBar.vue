<script setup lang="ts">
import { computed } from 'vue'

interface TabItem {
  id: string
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean
}

interface Props {
  items: TabItem[]
  modelValue?: string
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  modelValue: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [item: TabItem]
}>()

const _selectTab = (item: TabItem) => {
  if (item.disabled) return
  emit('update:modelValue', item.id)
  emit('select', item)
}
</script>

<template>
  <nav :class="['fixed bottom-0 left-0 right-0 z-50 border-t bg-background', _props.class]">
    <div class="flex h-16 items-center justify-around px-4">
      <button
        v-for="item in items"
        :key="item.id"
        :disabled="item.disabled"
        :class="[
          'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs transition-colors',
          modelValue === item.id 
            ? 'text-primary' 
            : 'text-muted-foreground hover:text-foreground',
          item.disabled && 'opacity-50 cursor-not-allowed'
        ]"
        @click="_selectTab(item)"
      >
        <div class="relative">
          <span v-if="item.icon" :class="[item.icon, 'h-5 w-5']" />
          <span
            v-if="item.badge"
            class="absolute -right-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground"
          >
            {{ typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge }}
          </span>
        </div>
        <span class="max-w-[4rem] truncate">{{ item.label }}</span>
      </button>
    </div>
  </nav>
</template>
