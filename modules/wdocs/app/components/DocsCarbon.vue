<script setup lang="ts">
const props = defineProps<{
  code: string
  placement: string
}>()

onMounted(() => {
  const script = document.createElement('script')
  script.src = `//cdn.carbonads.com/carbon.js?serve=${props.code}&placement=${props.placement}`
  script.id = '_carbonads_js'
  script.async = true
  const container = document.getElementById('carbon-ads')
  if (container) {
    container.appendChild(script)
  }
})
</script>

<template>
  <div id="carbon-ads" class="docs-carbon" />
</template>
