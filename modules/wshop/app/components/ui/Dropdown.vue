<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface DropdownItem {
  label: string
  value: string | number
  icon?: string
  disabled?: boolean
  divider?: boolean
}

interface Props {
  items: DropdownItem[]
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
  trigger?: 'click' | 'hover'
}

const props = withDefaults(defineProps<Props>(), {
  placement: 'bottom-left',
  trigger: 'click'
})

const emit = defineEmits<{
  select: [item: DropdownItem]
}>()

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement>()

const placementClasses = {
  'bottom-left': 'top-full left-0 mt-1',
  'bottom-right': 'top-full right-0 mt-1',
  'top-left': 'bottom-full left-0 mb-1',
  'top-right': 'bottom-full right-0 mb-1'
}

const handleClickOutside = (e: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    isOpen.value = false
  }
}

const selectItem = (item: DropdownItem) => {
  if (item.disabled) return
  emit('select', item)
  isOpen.value = false
}

const toggle = () => {
  isOpen.value = !isOpen.value
}

const activeItemIndex = ref(-1)

const handleKeyNavigation = (e: KeyboardEvent) => {
  if (!isOpen.value) return

  const enabledItems = props.items.filter(item => !item.disabled && !item.divider)

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeItemIndex.value = (activeItemIndex.value + 1) % enabledItems.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeItemIndex.value = activeItemIndex.value <= 0 ? enabledItems.length - 1 : activeItemIndex.value - 1
  } else if (e.key === 'Enter' && activeItemIndex.value >= 0) {
    e.preventDefault()
    selectItem(enabledItems[activeItemIndex.value])
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="relative inline-block text-left"
  >
    <div
      ref="triggerRef"
      @click="toggle"
      @mouseenter="trigger === 'hover' && (isOpen = true)"
    >
      <slot name="trigger" :toggle="toggle" :is-open="isOpen">
        <WShopButton variant="ghost">
          Options
          <svg
            class="ml-2 h-4 w-4 transition-transform duration-200"
            :class="isOpen ? 'rotate-180' : ''"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </WShopButton>
      </slot>
    </div>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute z-50 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        :class="placementClasses[placement]"
        role="menu"
        aria-orientation="vertical"
        tabindex="-1"
        @mouseleave="trigger === 'hover' && (isOpen = false)"
        @keydown="handleKeyNavigation"
      >
        <div class="py-1" role="none">
          <template v-for="(item, index) in items" :key="index">
            <hr
              v-if="item.divider"
              class="my-1 border-secondary-200"
            >
            <button
              v-else
              type="button"
              class="w-full text-left px-4 py-2 text-sm flex items-center"
              :class="[
                item.disabled
                  ? 'text-secondary-400 cursor-not-allowed'
                  : 'text-secondary-700 hover:bg-secondary-50 hover:text-secondary-900',
                activeItemIndex === index ? 'bg-secondary-50' : ''
              ]"
              role="menuitem"
              :disabled="item.disabled"
              @click="selectItem(item)"
            >
              <span
                v-if="item.icon"
                class="mr-3 h-5 w-5"
                aria-hidden="true"
              >
                {{ item.icon }}
              </span>
              {{ item.label }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>
