<script setup lang="ts">
import mermaid from 'mermaid'

const props = defineProps<{
  diagram: string
}>()

const diagramRef = ref<HTMLDivElement>()
const svg = ref('')

onMounted(async () => {
  mermaid.initialize({ startOnLoad: false, theme: 'default' })
  if (diagramRef.value) {
    const { svg: rendered } = await mermaid.render('mermaid-' + Date.now(), props.diagram)
    svg.value = rendered
  }
})
</script>

<template>
  <div ref="diagramRef" class="docs-mermaid" v-html="svg" />
</template>
