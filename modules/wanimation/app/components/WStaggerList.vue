<script setup lang="ts">
import anime from 'animejs'

interface Props {
  items: unknown[]
  keyProp?: string
  stagger?: number
  duration?: number
  easing?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  keyProp: 'id',
  stagger: 50,
  duration: 400,
  easing: 'easeOutCubic',
  direction: 'up',
  distance: 30,
  tag: 'div',
})

const listRef = ref<HTMLElement | null>(null)

const getTransform = (): { translateX?: number; translateY?: number } => {
  switch (props.direction) {
    case 'up':
      return { translateY: props.distance }
    case 'down':
      return { translateY: -props.distance }
    case 'left':
      return { translateX: props.distance }
    case 'right':
      return { translateX: -props.distance }
    default:
      return { translateY: props.distance }
  }
}

const animateItems = (): void => {
  if (!listRef.value) return

  const children = listRef.value.children
  const transform = getTransform()

  anime({
    targets: children,
    opacity: [0, 1],
    ...transform,
    duration: props.duration,
    delay: anime.stagger(props.stagger),
    easing: props.easing,
  })
}

watch(() => props.items, () => {
  nextTick(() => {
    animateItems()
  })
}, { deep: true })

onMounted(() => {
  animateItems()
})
</script>

<template>
  <component :is="tag" ref="listRef" class="w-stagger-list">
    <div
      v-for="(item, index) in items"
      :key="keyProp ? (item as Record<string, unknown>)[keyProp] ?? index : index"
      class="w-stagger-item"
      style="opacity: 0;"
    >
      <slot :item="item" :index="index">
        {{ item }}
      </slot>
    </div>
  </component>
</template>
