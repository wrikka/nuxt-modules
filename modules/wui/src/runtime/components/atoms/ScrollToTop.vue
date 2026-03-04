<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  offset?: number
  smooth?: boolean
  threshold?: number
}

const props = withDefaults(defineProps<Props>(), {
  offset: 0,
  smooth: true,
  threshold: 300
})

const visible = ref(false)

const checkScroll = () => {
  visible.value = window.scrollY > props.threshold
}

const scrollToTop = () => {
  window.scrollTo({
    top: props.offset,
    behavior: props.smooth ? 'smooth' : 'auto'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <Button
      v-if="visible"
      variant="solid"
      size="md"
      class="fixed bottom-4 right-4 rounded-full shadow-lg z-50"
      @click="scrollToTop"
    >
      <span class="i-lucide-arrow-up" />
    </Button>
  </Transition>
</template>
