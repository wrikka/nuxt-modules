<script setup lang="ts">
import { useData } from 'vitepress'

const { page, theme } = useData()
</script>

<template>
  <WFlex direction="row" gap="md" class="min-h-screen bg-background">
    <!-- Left Sidebar - Navigation -->
    <aside class="w-64 bg-muted/50 border-r border-border p-4 overflow-y-auto">
      <WHeading :level="3" class="mb-4">Navigation</WHeading>
      <nav class="space-y-2">
        <VPNav />
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-4 overflow-y-auto">
      <WContainer class="max-w-4xl mx-auto">
        <article class="prose prose-gray dark:prose-invert max-w-none prose-foreground prose-headings:text-foreground prose-p:text-muted-foreground prose-code:bg-muted prose-code:text-code prose-pre:bg-muted prose-pre:border prose-a:text-primary prose-a:hover:text-primary/80">
          <WHeading :level="1" class="mb-6">{{ page.title }}</WHeading>
          <Content />
        </article>
      </WContainer>
    </main>

    <!-- Right Sidebar - Table of Contents -->
    <aside class="w-64 bg-muted/30 border-l border-border p-4 overflow-y-auto">
      <WCard class="sticky top-4">
        <WCardContent class="p-4">
          <WHeading :level="3" class="mb-4">Table of Contents</WHeading>
          <VPDocOutline />
        </WCardContent>
      </WCard>
    </aside>
  </WFlex>
</template>
