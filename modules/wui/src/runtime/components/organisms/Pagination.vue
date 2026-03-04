<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  total: number
  pageSize?: number
  currentPage?: number
  siblingCount?: number
  boundaryCount?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const _props = withDefaults(defineProps<Props>(), {
  pageSize: 10,
  currentPage: 1,
  siblingCount: 1,
  boundaryCount: 1,
  showFirstLast: true,
  showPrevNext: true,
  size: 'md'
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
}>()

const _totalPages = computed(() => Math.ceil(_props.total / _props.pageSize))

const _sizeClasses = computed(() => ({
  sm: 'h-7 w-7 text-xs',
  md: 'h-9 w-9 text-sm',
  lg: 'h-11 w-11 text-base'
}));

const _pages = computed(() => {
  const total = _totalPages.value
  const current = _props.currentPage
  const sibling = _props.siblingCount
  const boundary = _props.boundaryCount

  const range = (start: number, end: number) => 
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const startPages = range(1, Math.min(boundary, total))
  const endPages = range(Math.max(total - boundary + 1, boundary + 1), total)

  const siblingsStart = Math.max(
    Math.min(current - sibling, total - boundary - sibling * 2 - 1),
    boundary + 2
  )
  const siblingsEnd = Math.min(
    Math.max(current + sibling, boundary + sibling * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : total - 1
  )

  const pages: (number | string)[] = [...startPages]

  if (siblingsStart > boundary + 2) {
    pages.push('...')
  }
  else if (boundary + 1 < siblingsStart) {
    pages.push(boundary + 1)
  }

  pages.push(...range(siblingsStart, siblingsEnd))

  if (siblingsEnd < total - boundary - 1) {
    pages.push('...')
  }
  else if (siblingsEnd < total - boundary) {
    pages.push(total - boundary)
  }

  pages.push(...endPages)

  return pages.filter((page, index, arr) => 
    arr.indexOf(page) === index
  )
})

const _goToPage = (page: number) => {
  if (page >= 1 && page <= _totalPages.value && page !== _props.currentPage) {
    emit('update:currentPage', page)
  }
}

const _buttonClasses = (page: number | string, isActive: boolean) => [
  'inline-flex items-center justify-center rounded-md border transition-colors',
  'hover:bg-accent hover:text-accent-foreground',
  isActive 
    ? 'border-primary bg-primary text-primary-foreground hover:bg-primary/90' 
    : 'border-input bg-background',
  _sizeClasses.value[_props.size]
]
</script>

<template>
  <nav :class="['flex items-center gap-1', _props.class]" aria-label="Pagination">
    <button
      v-if="showFirstLast"
      :disabled="currentPage === 1"
      :class="[_buttonClasses('first', false), 'disabled:opacity-50 disabled:cursor-not-allowed']"
      @click="_goToPage(1)"
    >
      <span class="i-lucide-chevrons-left h-4 w-4" />
    </button>
    
    <button
      v-if="showPrevNext"
      :disabled="currentPage === 1"
      :class="[_buttonClasses('prev', false), 'disabled:opacity-50 disabled:cursor-not-allowed']"
      @click="_goToPage(currentPage - 1)"
    >
      <span class="i-lucide-chevron-left h-4 w-4" />
    </button>

    <button
      v-for="page in _pages"
      :key="page"
      :disabled="page === '...'"
      :class="[_buttonClasses(page, page === currentPage), page === '...' && 'cursor-default border-transparent']"
      @click="typeof page === 'number' && _goToPage(page)"
    >
      {{ page }}
    </button>

    <button
      v-if="showPrevNext"
      :disabled="currentPage === _totalPages"
      :class="[_buttonClasses('next', false), 'disabled:opacity-50 disabled:cursor-not-allowed']"
      @click="_goToPage(currentPage + 1)"
    >
      <span class="i-lucide-chevron-right h-4 w-4" />
    </button>
    
    <button
      v-if="showFirstLast"
      :disabled="currentPage === _totalPages"
      :class="[_buttonClasses('last', false), 'disabled:opacity-50 disabled:cursor-not-allowed']"
      @click="_goToPage(_totalPages)"
    >
      <span class="i-lucide-chevrons-right h-4 w-4" />
    </button>
  </nav>
</template>
