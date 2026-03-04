<script setup lang="ts">
const props = defineProps<{
  code: string
  language?: string
  filename?: string
}>()

const copied = ref(false)

async function copyCode() {
  await navigator.clipboard.writeText(props.code)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="docs-code-block">
    <div v-if="filename || language" class="docs-code-header">
      <span class="docs-code-lang">{{ filename || language }}</span>
      <button class="docs-code-copy" @click="copyCode">
        <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" :class="{ 'text-green-400': copied }" class="w-4 h-4" />
      </button>
    </div>
    <button v-else class="docs-copy-btn" @click="copyCode">
      <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" :class="{ 'docs-copy-btn-copied': copied }" class="w-4 h-4" />
    </button>
    <slot />
  </div>
</template>
