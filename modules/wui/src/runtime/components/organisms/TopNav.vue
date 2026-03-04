<script setup lang="ts">
import { computed } from 'vue'

interface NavItem {
  label: string
  href?: string
  icon?: string
  active?: boolean
  external?: boolean
}

interface Props {
  logo?: string
  items: NavItem[]
  sticky?: boolean
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  sticky: true
})

const emit = defineEmits<{
  'select': [item: NavItem]
  'logoClick': []
}>()
</script>

<template>
  <header
    :class="[
      'top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      sticky && 'sticky'
    ]"
  >
    <div :class="['container flex h-14 items-center', _props.class]">
      <div class="mr-4 flex items-center gap-2">
        <button v-if="logo" @click="$emit('logoClick')">
          <img :src="logo" alt="Logo" class="h-8 w-auto">
        </button>
        <slot name="logo" />
      </div>

      <nav class="hidden flex-1 items-center gap-6 md:flex">
        <component
          :is="item.href ? 'a' : 'button'"
          v-for="(item, index) in items"
          :key="index"
          :href="item.href"
          :target="item.external ? '_blank' : undefined"
          :rel="item.external ? 'noopener noreferrer' : undefined"
          :class="[
            'flex items-center gap-1.5 text-sm font-medium transition-colors',
            item.active 
              ? 'text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
          ]"
          @click="!item.href && $emit('select', item)"
        >
          <span v-if="item.icon" :class="[item.icon, 'h-4 w-4']" />
          {{ item.label }}
          <span v-if="item.external" class="i-lucide-external-link h-3 w-3" />
        </component>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>
