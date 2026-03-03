<script setup lang="ts">
import { computed, provide } from 'vue'

interface NavItem {
  label: string
  href?: string
  icon?: string
  active?: boolean
  badge?: string | number
  children?: NavItem[]
}

interface Props {
  items: NavItem[]
  collapsed?: boolean
  collapsible?: boolean
  width?: string
  collapsedWidth?: string
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  collapsible: true,
  width: '16rem',
  collapsedWidth: '4rem'
})

const emit = defineEmits<{
  'update:collapsed': [value: boolean]
  'select': [item: NavItem]
}>()

const _isCollapsed = computed({
  get: () => _props.collapsed,
  set: (val) => emit('update:collapsed', val)
})

const _sidebarWidth = computed(() => 
  _isCollapsed.value ? _props.collapsedWidth : _props.width
)

const _toggleCollapse = () => {
  _isCollapsed.value = !_isCollapsed.value
}

provide('sidebar', {
  collapsed: _isCollapsed,
  selectItem: (item: NavItem) => emit('select', item)
})
</script>

<template>
  <aside
    :class="['flex flex-col border-r bg-background transition-all duration-300', _props.class]"
    :style="{ width: _sidebarWidth }"
  >
    <div class="flex h-14 items-center border-b px-4">
      <slot name="header" :collapsed="_isCollapsed" />
    </div>

    <nav class="flex-1 overflow-auto py-4">
      <ul class="space-y-1 px-2">
        <li v-for="(item, index) in items" :key="index">
          <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href"
            :class="[
              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              item.active 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent/50 hover:text-accent-foreground'
            ]"
            @click="!item.href && $emit('select', item)"
          >
            <span v-if="item.icon" :class="[item.icon, 'h-4 w-4 shrink-0']" />
            <span v-if="!_isCollapsed" class="flex-1 text-left">{{ item.label }}</span>
            <span
              v-if="item.badge && !_isCollapsed"
              class="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground"
            >
              {{ item.badge }}
            </span>
          </component>
          
          <ul v-if="item.children && item.active && !_isCollapsed" class="ml-4 mt-1 space-y-1">
            <li v-for="(child, childIndex) in item.children" :key="childIndex">
              <component
                :is="child.href ? 'a' : 'button'"
                :href="child.href"
                :class="[
                  'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                  child.active 
                    ? 'bg-accent/50 text-accent-foreground' 
                    : 'hover:bg-accent/30 hover:text-accent-foreground'
                ]"
                @click="!child.href && $emit('select', child)"
              >
                <span v-if="child.icon" :class="[child.icon, 'h-3.5 w-3.5']" />
                <span>{{ child.label }}</span>
              </component>
            </li>
          </ul>
        </li>
      </ul>
    </nav>

    <div class="border-t p-4">
      <slot name="footer" :collapsed="_isCollapsed" />
    </div>

    <button
      v-if="collapsible"
      class="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent"
      @click="_toggleCollapse"
    >
      <span :class="[_isCollapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left', 'h-3 w-3']" />
    </button>
  </aside>
</template>
