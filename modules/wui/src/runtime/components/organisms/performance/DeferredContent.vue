<script setup lang="ts">
interface Props {
  loaded?: boolean
  minHeight?: string
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  loaded: false,
  minHeight: '100px',
  delay: 0
})

const shouldRender = ref(props.loaded)
const elementRef = ref<HTMLDivElement>()

let observer: IntersectionObserver | null = null
let delayTimeout: ReturnType<typeof setTimeout> | null = null

const setupObserver = () => {
  if (!elementRef.value || props.loaded) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (props.delay > 0) {
            delayTimeout = setTimeout(() => {
              shouldRender.value = true
            }, props.delay)
          } else {
            shouldRender.value = true
          }
          observer?.disconnect()
        }
      })
    },
    {
      root: null,
      rootMargin: '0px',
      threshold: 0
    }
  )

  observer.observe(elementRef.value)
}

onMounted(() => {
  if (props.loaded) {
    shouldRender.value = true
  } else {
    setupObserver()
  }
})

onUnmounted(() => {
  observer?.disconnect()
  if (delayTimeout) {
    clearTimeout(delayTimeout)
  }
})

watch(() => props.loaded, (newValue) => {
  if (newValue) {
    shouldRender.value = true
    observer?.disconnect()
  }
})
</script>

<template>
  <div
    ref="elementRef"
    :style="{ minHeight: shouldRender ? undefined : minHeight }"
  >
    <Transition name="deferred">
      <div v-if="shouldRender">
        <slot />
      </div>
      <div v-else class="flex items-center justify-center" :style="{ height: minHeight }">
        <Spinner size="sm" />
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.deferred-enter-active,
.deferred-leave-active {
  transition: opacity 0.3s ease;
}

.deferred-enter-from,
.deferred-leave-to {
  opacity: 0;
}
</style>
