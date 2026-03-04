<script setup lang="ts">
interface DockItem {
  id: string
  icon: string
  label: string
  badge?: number | string
  color?: string
  active?: boolean
}

interface Props {
  items: DockItem[]
  position?: 'bottom' | 'left' | 'right' | 'top'
  size?: 'sm' | 'md' | 'lg'
  magnification?: boolean
  magnificationScale?: number
}

const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
  size: 'md',
  magnification: true,
  magnificationScale: 1.5
})

const emit = defineEmits<{
  itemClick: [item: DockItem]
}>()

const hoveredItem = ref<string | null>(null)

const sizeClasses = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-14 w-14'
}

const iconSizes = {
  sm: 'size-5',
  md: 'size-6',
  lg: 'size-7'
}

const positionClasses = {
  bottom: 'bottom-4 left-1/2 -translate-x-1/2 flex-row',
  top: 'top-4 left-1/2 -translate-x-1/2 flex-row',
  left: 'left-4 top-1/2 -translate-y-1/2 flex-col',
  right: 'right-4 top-1/2 -translate-y-1/2 flex-col'
}

const getItemScale = (id: string) => {
  if (!props.magnification || !hoveredItem.value) return 1
  if (hoveredItem.value === id) return props.magnificationScale
  return 1
}

const handleClick = (item: DockItem) => {
  emit('itemClick', item)
}
</script>

<template>
  <div
    class="fixed z-50 flex items-end gap-2 rounded-2xl bg-white/80 p-3 shadow-2xl backdrop-blur-md transition-all"
    :class="positionClasses[position]"
  >
    <div
      v-for="item in items"
      :key="item.id"
      class="group relative"
      @mouseenter="hoveredItem = item.id"
      @mouseleave="hoveredItem = null"
    >
      <button
        type="button"
        class="flex items-center justify-center rounded-xl transition-all duration-200"
        :class="[sizeClasses[size], item.active ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-gray-100 hover:bg-gray-200']"
        :style="{ transform: `scale(${getItemScale(item.id)})` }"
        @click="handleClick(item)"
      >
        <span :class="[item.icon, iconSizes[size], item.color || 'text-gray-700']" />
      </button>

      <span
        v-if="item.badge"
        class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
      >
        {{ item.badge }}
      </span>

      <div
        v-if="hoveredItem === item.id"
        class="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2 py-1 text-xs text-white"
        :class="position === 'top' ? 'top-full mt-2' : ''"
      >
        {{ item.label }}
      </div>

      <div
        v-if="item.active && position === 'bottom'"
        class="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gray-400"
      />
    </div>
  </div>
</template>
