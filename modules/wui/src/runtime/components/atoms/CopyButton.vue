<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  text: string
  copiedText?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'ghost' | 'outline' | 'solid'
}

const props = withDefaults(defineProps<Props>(), {
  copiedText: 'Copied!',
  size: 'sm',
  variant: 'ghost'
})

const copied = ref(false)

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.text)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <Button
    :size="size"
    :variant="variant"
    @click="handleCopy"
  >
    <span v-if="copied" class="i-lucide-check mr-1" />
    <span v-else class="i-lucide-copy mr-1" />
    {{ copied ? copiedText : 'Copy' }}
  </Button>
</template>
