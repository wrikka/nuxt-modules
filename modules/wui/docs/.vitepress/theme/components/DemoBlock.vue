<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  title?: string
  description?: string
}

const _props = withDefaults(defineProps<Props>(), {
  title: 'Example',
  description: ''
})

const _activeTab = ref('preview')

const _copyCode = (event: Event) => {
  const button = event.target as HTMLElement
  const preElement = button.closest('.relative')?.querySelector('pre code')
  if (preElement) {
    navigator.clipboard.writeText(preElement.textContent || '')
  }
}
</script>

<template>
  <WCard class="my-6">
    <WCardHeader v-if="_props.title || _props.description">
      <WCardTitle v-if="_props.title">{{ _props.title }}</WCardTitle>
      <p v-if="_props.description" class="text-muted-foreground mt-2">
        {{ _props.description }}
      </p>
    </WCardHeader>
    <WCardContent>
      <WTabs v-model="_activeTab" class="w-full">
        <WTabsList class="grid w-full grid-cols-2">
          <WTabsTrigger value="preview">Preview</WTabsTrigger>
          <WTabsTrigger value="code">Code</WTabsTrigger>
        </WTabsList>

        <WTabsContent value="preview" class="mt-4">
          <div class="border rounded-lg p-4 bg-background">
            <slot name="preview" />
          </div>
        </WTabsContent>

        <WTabsContent value="code" class="mt-4">
          <div class="relative">
            <pre class="bg-muted p-4 rounded-lg overflow-x-auto text-sm"><code><slot name="code" /></code></pre>
            <WButton
              variant="outline"
              size="sm"
              class="absolute top-2 right-2"
              @click="_copyCode"
            >
              Copy
            </WButton>
          </div>
        </WTabsContent>
      </WTabs>
    </WCardContent>
  </WCard>
</template>

<style scoped>
pre {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
}

code {
  font-family: inherit;
}
</style>
