<script setup lang="ts">
import anime from 'animejs'
import type { AnimationOptions } from '~/types/animation'

interface Props {
  enterOptions?: Partial<AnimationOptions>
  leaveOptions?: Partial<AnimationOptions>
  duration?: number
  enterDuration?: number
  leaveDuration?: number
  easing?: string
  tag?: string
  mode?: 'default' | 'out-in' | 'in-out'
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  duration: 300,
  easing: 'easeOutQuad',
  mode: 'default',
})

const enterDuration = computed(() => props.enterDuration ?? props.duration)
const leaveDuration = computed(() => props.leaveDuration ?? props.duration)

const onEnter = (el: Element, done: () => void): void => {
  anime({
    targets: el,
    opacity: [0, 1],
    translateY: [20, 0],
    duration: enterDuration.value,
    easing: props.easing,
    ...props.enterOptions,
    complete: () => done(),
  })
}

const onLeave = (el: Element, done: () => void): void => {
  anime({
    targets: el,
    opacity: [1, 0],
    translateY: [0, -20],
    duration: leaveDuration.value,
    easing: 'easeInQuad',
    ...props.leaveOptions,
    complete: () => done(),
  })
}
</script>

<template>
  <Transition
    :mode="mode"
    @enter="onEnter"
    @leave="onLeave"
  >
    <slot />
  </Transition>
</template>
