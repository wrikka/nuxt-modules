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
  trigger?: 'click' | 'contextmenu'
}

const props = withDefaults(defineProps<Props>(), {
  trigger: 'contextmenu'
})

const emit = defineEmits<{
  itemClick: [item: MenuItem]
}>()

const isOpen = ref(false)
const position = ref({ x: 0, y: 0 })
const menuRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLDivElement>()
const activeSubmenu = ref<string | null>(null)

const handleTrigger = (e: MouseEvent) => {
  if (props.trigger === 'contextmenu') {
    e.preventDefault()
  }
  position.value = { x: e.clientX, y: e.clientY }
  isOpen.value = true
  activeSubmenu.value = null
}

const handleItemClick = (item: MenuItem) => {
  if (item.disabled || item.children?.length) return
  item.action?.()
  emit('itemClick', item)
  isOpen.value = false
}

const toggleSubmenu = (item: MenuItem) => {
  if (!item.children?.length) return
  activeSubmenu.value = activeSubmenu.value === item.id ? null : item.id
}

onClickOutside(menuRef, () => {
  isOpen.value = false
})

onKeyDown('Escape', () => {
  isOpen.value = false
})
</script>

<template>
  <div
    ref="containerRef"
    @click="trigger === 'click' && handleTrigger($event)"
    @contextmenu="trigger === 'contextmenu' && handleTrigger($event)"
  >
    <slot />
  </div>

  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="menuRef"
      class="fixed z-50 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      :style="{ left: `${position.x}px`, top: `${position.y}px` }"
    >
      <template v-for="item in items" :key="item.id">
        <div
          v-if="item.separator"
          class="my-1 h-px bg-gray-200"
        />
        <div
          v-else
          class="group relative"
          @mouseenter="item.children?.length && toggleSubmenu(item)"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-gray-100"
            :class="{ 'opacity-50': item.disabled }"
            :disabled="item.disabled"
            @click="handleItemClick(item)"
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

          <div
            v-if="item.children && activeSubmenu === item.id"
            class="absolute left-full top-0 ml-1 min-w-[160px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
          >
            <button
              v-for="child in item.children"
              :key="child.id"
              type="button"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
              :class="{ 'opacity-50': child.disabled }"
              :disabled="child.disabled"
              @click="handleItemClick(child)"
            >
              <span v-if="child.icon" :class="child.icon" />
              <span>{{ child.label }}</span>
            </button>
          </div>
        </div>
      </template>
    </div>
  </Teleport>
</template>
