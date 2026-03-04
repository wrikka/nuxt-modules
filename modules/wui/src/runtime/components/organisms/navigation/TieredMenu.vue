<script setup lang="ts">
interface MenuItem {
  id: string
  label: string
  icon?: string
  shortcut?: string
  disabled?: boolean
  separator?: boolean
  children?: MenuItem[]
  action?: () => void
}

interface Props {
  items: MenuItem[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  itemClick: [item: MenuItem]
}>()

const activePath = ref<string[]>([])

const handleItemClick = (item: MenuItem, level: number) => {
  if (item.disabled) return
  if (item.children?.length) {
    activePath.value = [...activePath.value.slice(0, level), item.id]
  } else {
    item.action?.()
    emit('itemClick', item)
    activePath.value = []
  }
}

const isActive = (item: MenuItem, level: number) => {
  return activePath.value[level] === item.id
}

const getVisibleChildren = (items: MenuItem[], level: number): MenuItem[] => {
  if (level === 0) return items
  const parentId = activePath.value[level - 1]
  const parent = items.find(item => item.id === parentId)
  return parent?.children || []
}

const clearPath = () => {
  activePath.value = []
}
</script>

<template>
  <div class="flex rounded-lg border border-gray-200 bg-white" @mouseleave="clearPath">
    <div
      v-for="level in Math.max(1, activePath.length + 1)"
      :key="level"
      class="min-w-[180px] border-r border-gray-200 last:border-0"
    >
      <template v-for="item in getVisibleChildren(items, level - 1)" :key="item.id">
        <div v-if="item.separator" class="my-1 h-px bg-gray-200" />
        <button
          v-else
          type="button"
          class="flex w-full items-center justify-between px-4 py-2 text-sm hover:bg-gray-100"
          :class="{
            'bg-blue-50 text-blue-600': isActive(item, level - 1),
            'opacity-50': item.disabled
          }"
          :disabled="item.disabled"
          @click="handleItemClick(item, level - 1)"
          @mouseenter="item.children?.length && (activePath = [...activePath.slice(0, level - 1), item.id])"
        >
          <div class="flex items-center gap-2">
            <span v-if="item.icon" :class="item.icon" />
            <span>{{ item.label }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="item.shortcut" class="text-xs text-gray-400">{{ item.shortcut }}</span>
            <span
              v-if="item.children?.length"
              class="i-lucide-chevron-right size-4 text-gray-400"
            />
          </div>
        </button>
      </template>
    </div>
  </div>
</template>
