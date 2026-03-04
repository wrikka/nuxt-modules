<script setup lang="ts">
import { computed } from 'vue'

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: string
}

interface Props {
  items: BreadcrumbItem[]
  separator?: 'slash' | 'chevron' | 'arrow'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  separator: 'chevron'
})

const _separatorIcon = computed(() => ({
  slash: 'i-lucide-slash',
  chevron: 'i-lucide-chevron-right',
  arrow: 'i-lucide-arrow-right'
}));
</script>

<template>
  <nav :class="['flex', _props.class]" aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground">
      <li
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-1.5"
      >
        <span
          v-if="index > 0"
          :class="[_separatorIcon[separator], 'h-4 w-4']"
          aria-hidden="true"
        />
        
        <component
          :is="item.href ? 'a' : 'span'"
          :href="item.href"
          :class="[
            'flex items-center gap-1 transition-colors',
            item.href 
              ? 'hover:text-foreground' 
              : index === items.length - 1 
                ? 'font-medium text-foreground' 
                : ''
          ]"
        >
          <span v-if="item.icon" :class="[item.icon, 'h-4 w-4']" />
          {{ item.label }}
        </component>
      </li>
    </ol>
  </nav>
</template>
