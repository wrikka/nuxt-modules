<template>
  <div class="markdown-render" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<style scoped>
.markdown-render {
  /* Add any custom styles for markdown content */
  line-height: 1.6;
}

.markdown-render h1,
.markdown-render h2,
.markdown-render h3,
.markdown-render h4,
.markdown-render h5,
.markdown-render h6 {
  margin-top: 1em;
  margin-bottom: 0.5em;
}

.markdown-render p {
  margin-bottom: 1em;
}

.markdown-render ul,
.markdown-render ol {
  margin-bottom: 1em;
  padding-left: 2em;
}

.markdown-render code {
  background-color: #f1f1f1;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.markdown-render pre {
  background-color: #f1f1f1;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}

.markdown-render pre code {
  background: none;
  padding: 0;
}

.markdown-render blockquote {
  border-left: 4px solid #ccc;
  padding-left: 1em;
  margin-left: 0;
  color: #666;
}
</style>
