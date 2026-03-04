<script setup lang="ts">
interface Props {
  items: any[]
  itemHeight?: number
  containerHeight?: number
  overscan?: number
}

const props = withDefaults(defineProps<Props>(), {
  itemHeight: 50,
  containerHeight: 400,
  overscan: 5
})

const containerRef = ref<HTMLDivElement>()
const scrollTop = ref(0)

const totalHeight = computed(() => props.items.length * props.itemHeight)

const visibleRange = computed(() => {
  const start = Math.floor(scrollTop.value / props.itemHeight)
  const visibleCount = Math.ceil(props.containerHeight / props.itemHeight)
  const end = Math.min(start + visibleCount + props.overscan, props.items.length)
  return {
    start: Math.max(0, start - props.overscan),
    end
  }
})

const visibleItems = computed(() => {
  const { start, end } = visibleRange.value
  return props.items.slice(start, end).map((item, index) => ({
    item,
    index: start + index,
    style: {
      position: 'absolute',
      top: `${(start + index) * props.itemHeight}px`,
      height: `${props.itemHeight}px`
    }
  }))
})

const onScroll = (e: Event) => {
  scrollTop.value = (e.target as HTMLDivElement).scrollTop
}
</script>

<template>
  <div
    ref="containerRef"
    class="relative overflow-auto"
    :style="{ height: `${containerHeight}px` }"
    @scroll="onScroll"
  >
    <div :style="{ height: `${totalHeight}px` }">
      <div
        v-for="{ item, index, style } in visibleItems"
        :key="index"
        class="absolute left-0 right-0"
        :style="style"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>
