<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage?: number
  totalPages?: number
  showFirstLast?: boolean
  showPrevNext?: boolean
  maxVisiblePages?: number
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  currentPage: 1,
  totalPages: 1,
  showFirstLast: true,
  showPrevNext: true,
  maxVisiblePages: 5,
  disabled: false
})

const emit = defineEmits<{
  'update:currentPage': [page: number]
  'page-change': [page: number]
}>()

const _visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, current - half)
    const end = Math.min(total, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
  }

  return pages
})

const _canGoFirst = computed(() => props.currentPage > 1)
const _canGoPrev = computed(() => props.currentPage > 1)
const _canGoNext = computed(() => props.currentPage < props.totalPages)
const _canGoLast = computed(() => props.currentPage < props.totalPages)

const goToPage = (page: number) => {
  if (!props.disabled && page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
    emit('page-change', page)
  }
}

const _goToFirst = () => goToPage(1)
const _goToPrev = () => goToPage(props.currentPage - 1)
const _goToNext = () => goToPage(props.currentPage + 1)
const _goToLast = () => goToPage(props.totalPages)

const _buttonClasses = (isActive: boolean = false) => [
  'inline-flex items-center justify-center w-10 h-10 rounded-md text-sm font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  'disabled:pointer-events-none disabled:opacity-50',
  isActive
    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
    : 'hover:bg-accent hover:text-accent-foreground'
]
</script>

<template>
  <nav :class="['flex items-center space-x-1', props.class]" role="navigation" aria-label="Pagination">
    <!-- First button -->
    <button
      v-if="props.showFirstLast"
      type="button"
      :class="_buttonClasses()"
      :disabled="props.disabled || !_canGoFirst"
      @click="_goToFirst"
    >
      <div class="i-lucide-chevrons-left h-4 w-4" />
      <span class="sr-only">First page</span>
    </button>

    <!-- Previous button -->
    <button
      v-if="props.showPrevNext"
      type="button"
      :class="_buttonClasses()"
      :disabled="props.disabled || !_canGoPrev"
      @click="_goToPrev"
    >
      <div class="i-lucide-chevron-left h-4 w-4" />
      <span class="sr-only">Previous page</span>
    </button>

    <!-- Page numbers -->
    <button
      v-for="page in _visiblePages"
      :key="page"
      type="button"
      :class="_buttonClasses(page === props.currentPage)"
      :disabled="props.disabled"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>

    <!-- Next button -->
    <button
      v-if="props.showPrevNext"
      type="button"
      :class="_buttonClasses()"
      :disabled="props.disabled || !_canGoNext"
      @click="_goToNext"
    >
      <div class="i-lucide-chevron-right h-4 w-4" />
      <span class="sr-only">Next page</span>
    </button>

    <!-- Last button -->
    <button
      v-if="props.showFirstLast"
      type="button"
      :class="_buttonClasses()"
      :disabled="props.disabled || !_canGoLast"
      @click="_goToLast"
    >
      <div class="i-lucide-chevrons-right h-4 w-4" />
      <span class="sr-only">Last page</span>
    </button>
  </nav>
</template>
